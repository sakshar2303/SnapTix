# SnapTix — System Architecture & Data Flow

This document details the multi-instance deployment architecture, real-time event pipeline, and lifecycle states of the SnapTix platform.

---

## 1. End-to-End Seat Lifecycle Sequence

```mermaid
sequenceDiagram
    autonumber
    actor UserA as Contender A (Winner)
    actor UserB as Contender B (Loser)
    participant WS as Socket.io Server (Pod 1)
    participant Redis as Redis (Upstash / Cluster)
    participant PG as Postgres (Neon / ACID)

    Note over UserA, UserB: Millisecond Race Condition
    UserA->>WS: emit("hold_seat", { seatId: "D5", userId: "A" })
    UserB->>WS: emit("hold_seat", { seatId: "D5", userId: "B" })

    WS->>Redis: SET seat:event1:D5 "A" NX EX 300
    Redis-->>WS: "OK" (Hold Granted)
    
    WS->>Redis: SET seat:event1:D5 "B" NX EX 300
    Redis-->>WS: nil (Key Exists - Race Lost)

    par Broadcast Winner & Loser
        WS-->>UserA: emit("seat_held", { seatId: "D5", ttl: 300 })
        WS-->>UserB: emit("hold_rejected", { seatId: "D5", reason: "Seat taken" })
        WS--)All Clients: broadcast("seat_held", { seatId: "D5" })
    end

    alt User A Completes Checkout within 5 minutes
        UserA->>WS: emit("confirm_booking", { seatId: "D5", userId: "A" })
        WS->>Redis: GET seat:event1:D5
        Redis-->>WS: "A" (Hold Verified)
        WS->>PG: INSERT INTO bookings (seat_id, user_id) VALUES ('D5', 'A')
        PG-->>WS: 201 Created (Transaction Committed)
        WS->>Redis: DEL seat:event1:D5
        WS--)All Clients: broadcast("seat_booked", { seatId: "D5" })
        WS-->>UserA: emit("booking_success", { ticketPass })
    else Hold Expires without Checkout (300s TTL)
        Redis-->>WS: Keyspace Expired Event (__keyevent@0__:expired)
        WS--)All Clients: broadcast("seat_released", { seatId: "D5", reason: "EXPIRED" })
    end
```

---

## 2. Multi-Instance Cluster Scalability Architecture

```mermaid
graph TB
    subgraph "Clients"
        C1["Client 1 (Browser)"]
        C2["Client 2 (Browser)"]
        C3["Client 3 (Browser)"]
    end

    subgraph "Edge / Load Balancing Layer"
        LB["Load Balancer (AWS ALB / Cloudflare)"]
    end

    subgraph "Stateless Application Pods"
        Pod1["SnapTix Pod 1<br/>Node.js + Socket.io"]
        Pod2["SnapTix Pod 2<br/>Node.js + Socket.io"]
    end

    subgraph "Distributed State & Coordination Layer"
        RedisAdapter["Redis Pub/Sub<br/>(@socket.io/redis-adapter)"]
        RedisLocks["Redis Key-Value Store<br/>(SET NX EX Atomic Locks)"]
    end

    subgraph "Durable Persistence Layer"
        Postgres[("Neon PostgreSQL<br/>ACID Transactions + UNIQUE Constraints")]
    end

    C1 <-->|WebSocket| LB
    C2 <-->|WebSocket| LB
    C3 <-->|WebSocket| LB

    LB --> Pod1
    LB --> Pod2

    Pod1 <-->|Pub/Sub Sync| RedisAdapter
    Pod2 <-->|Pub/Sub Sync| RedisAdapter

    Pod1 -->|Atomic Locks| RedisLocks
    Pod2 -->|Atomic Locks| RedisLocks

    Pod1 -->|Durable Ledger| Postgres
    Pod2 -->|Durable Ledger| Postgres
```

---

## 3. Ephemeral Live Presence Architecture

```mermaid
graph LR
    UserMouse["User Hovers Seat D5"] -->|throttled viewing_seat| SocketServer["Socket.io Server"]
    SocketServer -->|ephemeral in-memory set| PresenceMap["seatPresence Map<br/>(D5 -> Set of Sockets)"]
    PresenceMap -->|broadcast to room| OtherClients["Other Connected Clients<br/>Render '👀 2 looking' badge"]
    
    note["No Redis writes required!<br/>Zero database load.<br/>Purely ephemeral WebSockets."] -.- PresenceMap
```
