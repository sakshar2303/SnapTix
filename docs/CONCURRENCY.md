# SnapTix — Concurrency Control & Zero Double-Booking Strategy

> **Core Invariant**: Under high concurrent contention, when $N$ users attempt to claim the exact same seat within milliseconds of each other, **exactly 1 user succeeds** and **$N - 1$ users are cleanly rejected with sub-100ms latency**. Zero double-bookings occur.

---

## 1. Concurrency Control Strategy Chosen

SnapTix implements an **Optimistic Hold with Atomic Redis Locking (`SET NX EX`)** paired with a **Durable Postgres System-of-Record (ACID with `UNIQUE` constraint)**.

### The Atomic Locking Primitive

```redis
SET seat:{eventId}:{seatId} {userId} NX EX 300
```

* **`NX` (Not Exists)**: Sets the key *only* if the key does not already exist in Redis.
* **`EX 300` (Expire)**: Sets a hard physical Time-To-Live (TTL) of 300 seconds (5 minutes).

### Why This is Provably Atomic and Race-Free

1. **Single-Threaded Execution**: Redis processes commands sequentially on an internal single-threaded event loop. Even if 5,000 TCP requests hit the Redis server at the exact same microsecond, Redis serializes their execution in its command queue.
2. **No Window of Ambiguity**: Unlike a naive SQL approach:
   ```sql
   -- BROKEN ANTI-PATTERN:
   SELECT status FROM seats WHERE id = 'A1'; -- User 1 and User 2 both see 'available'
   UPDATE seats SET status = 'held' WHERE id = 'A1'; -- Both overwrite!
   ```
   The Redis `SET key value NX EX` evaluates key existence and writes the key in **one atomic memory step**. The first contender's command writes the key and returns `OK`. Every subsequent command in that millisecond observes that the key exists and returns `nil` (`null`).
3. **Instant Rejection**: The losing clients receive an immediate `hold_rejected` WebSocket message (or HTTP 409) within ~50ms. They are never left waiting until checkout to learn that their seat was lost.

---

## 2. Time-Boxed Seat Holds: The Zero-Zombie Guarantee

Seat holds must expire without requiring manual sweepers or fragile cron jobs.

* **Native Redis TTL**: The `EX 300` parameter places the expiration responsibility on the Redis engine itself. When 300 seconds elapse, Redis evicts the key.
* **Keyspace Notifications**: The backend subscribes to the Redis Pub/Sub channel:
  ```redis
  PSUBSCRIBE __keyevent@*__:expired
  ```
  When a key like `seat:venue-grand-hall:D5` expires, Redis emits an event. The backend extracts `seatId` and immediately broadcasts `seat_released` to all clients in the venue's Socket.io room.
* **Periodic Reconciler Fallback**: As a safety net for serverless platforms where Pub/Sub or keyspace events might be disabled, a lightweight active reconciler scans `seat:*` keys and releases any expired slots.

---

## 3. Durable Finalization: The Two-Phase Guarantee

A temporary Redis lock is not sufficient for a permanent booking ledger.

When the user confirms checkout:
1. **Ownership Verification**:
   ```javascript
   const currentHolder = await redis.get(holdKey);
   if (currentHolder !== userId) throw new Error("Hold expired or stolen");
   ```
2. **Durable Postgres Transaction**:
   The booking is written to Neon Postgres:
   ```sql
   INSERT INTO bookings (event_id, seat_id, user_id, price, tier)
   VALUES ($1, $2, $3, $4, $5);
   ```
   Postgres enforces `CONSTRAINT unique_event_seat UNIQUE (event_id, seat_id)`. Even if Redis were somehow corrupted or flushed mid-transaction, Postgres physically prevents duplicate bookings at the database engine level with error code `23505 (unique_violation)`.
3. **Lock Cleanup & Broadcast**:
   Upon transaction commit, `DEL seat:{eventId}:{seatId}` removes the hold key, and `seat_booked` is broadcast to all clients in real time.

---

## 4. Multi-Instance Scalability

```
          [ Clients (WebSockets / HTTP) ]
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
   [ App Server Pod 1 ]          [ App Server Pod 2 ]
          │      ▲                      │      ▲
          │      └──────┬───────────────┘      │
          ▼             ▼                      ▼
  [ Socket.io Redis Adapter (Pub/Sub) ]   [ Shared Redis ] (Locks)
                        │
                        ▼
                [ Neon Postgres ] (Durable)
```

1. **State Lives Outside the Process**: App servers do not store hold state in Node.js heap memory. If Pod 1 crashes, Pod 2 still reads and writes from the identical Redis state.
2. **Cross-Server Room Broadcasts**: With `@socket.io/redis-adapter`, when Pod 1 emits `seat_held` into `room:event:venue-grand-hall`, the adapter publishes the packet through Redis Pub/Sub. Pod 2 receives it and pushes it down the WebSocket to its own connected clients in sub-10ms.

---

## 5. What Changes at 10x Scale (100,000+ Concurrent Users)

| Component | Current Implementation | 10x Scale Architecture |
|---|---|---|
| **Redis Topology** | Single Redis instance / Upstash | **Redis Cluster** sharded by `{eventId}` hash tags so locks for one concert don't impact another. |
| **Durable Writes** | Direct synchronous Postgres INSERT inside HTTP handler | **Async Queue (BullMQ / Kafka)**: The server writes a lightweight confirmed receipt to Redis and enqueues the Postgres write asynchronously, keeping p99 checkout response time flat (<15ms). |
| **WebSocket Delivery** | Socket.io server mesh | **Dedicated Gateway Layer** (e.g. AWS API Gateway WebSocket or Centrifugo) offloading TLS termination and 50,000+ persistent socket connections from app servers. |
| **Flash Sale Admission** | Direct access to seat map | **Tokenized Virtual Waiting Room**: A FIFO queue issuing signed JWT admission tickets at controlled rate (e.g. 500 users/minute) to prevent DDoS on Redis. |

---

## 6. Explicitly Named Tradeoffs

* **Serverless Redis Latency vs Local Redis**: Cloud serverless Redis (e.g. Upstash over TLS) introduces 15–30ms network round-trip overhead compared to an in-VPC containerized Redis instance (~1ms).
* **Keyspace Notifications Reliability**: Redis keyspace notifications are "fire-and-forget" pub/sub. If a backend instance is disconnected during the exact millisecond an expiry event fires, it could miss the notification. To counter this, SnapTix incorporates a 5-second active TTL reconciler.
