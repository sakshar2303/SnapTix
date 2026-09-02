import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createAdapter } from "@socket.io/redis-adapter";
import { CONFIG } from "./config.js";
import { initDb, createBooking, getBookingsForEvent, isUsingFallback as isDbFallback } from "./db/index.js";
import { initRedis, getRedisClient, getRedisSub, redisEvents, isRedisMock } from "./redis.js";
import { VENUE_INFO, INITIAL_SEATS, TIERS, getEventById, generateSeatsForEvent, CATALOG } from "./data/venue.js";

const app = express();
const server = http.createServer(app);

// CORS configuration
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
}));
app.use(express.json());

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingTimeout: 30000,
  pingInterval: 10000,
});

// Ephemeral live presence tracking: seatId -> Set of socketIds
// Purely in-memory / non-persisted as requested in PRD
const seatPresence = new Map(); // seatId -> Set(socketId)
const socketToSeat = new Map(); // socketId -> seatId

// Live booking timestamps for velocity ticker (rolling 2-minute window)
const recentBookingTimes = [];

function recordBookingVelocity() {
  const now = Date.now();
  recentBookingTimes.push(now);
  cleanOldBookingTimes();
  return recentBookingTimes.length;
}

function cleanOldBookingTimes() {
  const cutoff = Date.now() - 2 * 60 * 1000;
  while (recentBookingTimes.length > 0 && recentBookingTimes[0] < cutoff) {
    recentBookingTimes.shift();
  }
}

function getRecentBookingCount() {
  cleanOldBookingTimes();
  return recentBookingTimes.length;
}

// Helpers for Redis seat hold keys
function getSeatHoldKey(eventId, seatId) {
  return `seat:${eventId}:${seatId}`;
}

function parseSeatHoldKey(key) {
  const parts = key.split(":");
  if (parts.length === 3 && parts[0] === "seat") {
    return { eventId: parts[1], seatId: parts[2] };
  }
  return null;
}

// Compile current state of all seats for an event
async function getEventState(eventId, requestingUserId = null) {
  const redis = getRedisClient();
  const eventObj = getEventById(eventId);
  const seatsForEvent = generateSeatsForEvent(eventObj);
  const bookings = await getBookingsForEvent(eventId);
  const bookedSeatMap = new Map(bookings.map((b) => [b.seat_id, b]));

  const seatsWithState = await Promise.all(
    seatsForEvent.map(async (seat) => {
      // 1. Check if booked in Postgres (durable)
      if (bookedSeatMap.has(seat.id)) {
        const booking = bookedSeatMap.get(seat.id);
        return {
          ...seat,
          status: "booked",
          bookedBy: booking.user_id,
          bookedAt: booking.booked_at,
          isMine: booking.user_id === requestingUserId,
        };
      }

      // 2. Check if held in Redis (ephemeral TTL hold)
      const holdKey = getSeatHoldKey(eventId, seat.id);
      const heldBy = await redis.get(holdKey);
      if (heldBy) {
        const ttlSeconds = await redis.ttl(holdKey);
        return {
          ...seat,
          status: "held",
          heldBy,
          isMine: heldBy === requestingUserId,
          ttlSeconds: ttlSeconds > 0 ? ttlSeconds : 0,
          expiresAt: Date.now() + (ttlSeconds > 0 ? ttlSeconds * 1000 : 0),
        };
      }

      // 3. Otherwise available
      return {
        ...seat,
        status: "available",
        isMine: false,
      };
    })
  );

  return {
    venue: eventObj,
    tiers: eventObj.sections,
    seats: seatsWithState,
    velocity: getRecentBookingCount(),
    stats: {
      total: seatsForEvent.length,
      booked: bookings.length,
      held: seatsWithState.filter((s) => s.status === "held").length,
      available: seatsWithState.filter((s) => s.status === "available").length,
    },
  };
}

// REST Endpoints
app.get("/health", async (req, res) => {
  const redis = getRedisClient();
  let redisPing = false;
  try {
    if (isRedisMock()) {
      redisPing = true;
    } else {
      const pong = await redis.ping();
      redisPing = pong === "PONG";
    }
  } catch (err) {
    redisPing = false;
  }

  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    db: {
      type: isDbFallback() ? "in-memory-atomic" : "postgres-neon",
      connected: true,
    },
    redis: {
      type: isRedisMock() ? "in-memory-atomic-emulator" : "upstash-live",
      connected: redisPing,
    },
    connectedSockets: io.engine.clientsCount,
    recentBookingsInLast2Min: getRecentBookingCount(),
  });
});

// Get venue & seat map state
app.get("/api/event", async (req, res) => {
  try {
    const eventId = req.query.eventId || CONFIG.EVENT_ID;
    const userId = req.query.userId;
    const state = await getEventState(eventId, userId);
    res.json(state);
  } catch (err) {
    console.error("Error fetching event state:", err);
    res.status(500).json({ error: "Failed to load event state" });
  }
});

// Get multi-event catalog
app.get("/api/catalog", (req, res) => {
  res.json(CATALOG);
});

// REST endpoint for hold - crucial for load testing!
app.post("/api/hold", async (req, res) => {
  const { eventId = CONFIG.EVENT_ID, seatId, userId, duration = CONFIG.HOLD_DURATION_SECONDS } = req.body;

  if (!seatId || !userId) {
    return res.status(400).json({ success: false, error: "seatId and userId are required" });
  }

  try {
    const redis = getRedisClient();
    const holdKey = getSeatHoldKey(eventId, seatId);

    // 1. Check if already booked in DB
    const bookings = await getBookingsForEvent(eventId);
    if (bookings.some((b) => b.seat_id === seatId)) {
      return res.status(409).json({
        success: false,
        status: "ALREADY_BOOKED",
        message: `Seat ${seatId} has already been permanently booked.`,
      });
    }

    // 2. ATOMIC REDIS SET NX EX
    // Redis guarantees that only one concurrent caller succeeds.
    const result = await redis.set(holdKey, userId, "NX", "EX", duration);

    if (result === "OK") {
      const expiresAt = Date.now() + duration * 1000;
      // Broadcast real-time hold to all connected clients
      io.to(`event:${eventId}`).emit("seat_held", {
        eventId,
        seatId,
        userId,
        duration,
        expiresAt,
      });

      return res.status(200).json({
        success: true,
        status: "HELD",
        seatId,
        userId,
        expiresAt,
        duration,
      });
    } else {
      // SET NX failed: already held
      return res.status(409).json({
        success: false,
        status: "ALREADY_HELD",
        seatId,
        message: `Seat ${seatId} was just claimed by another user.`,
      });
    }
  } catch (err) {
    console.error("Hold error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// REST endpoint for booking confirmation
app.post("/api/book", async (req, res) => {
  const { eventId = CONFIG.EVENT_ID, seatId, userId } = req.body;

  if (!seatId || !userId) {
    return res.status(400).json({ success: false, error: "seatId and userId are required" });
  }

  try {
    const redis = getRedisClient();
    const holdKey = getSeatHoldKey(eventId, seatId);

    // 1. Verify hold ownership in Redis
    const currentHolder = await redis.get(holdKey);
    if (!currentHolder) {
      return res.status(410).json({
        success: false,
        error: "HOLD_EXPIRED",
        message: `Your hold on seat ${seatId} has expired. Please select the seat again.`,
      });
    }

    if (currentHolder !== userId) {
      return res.status(403).json({
        success: false,
        error: "HOLD_MISMATCH",
        message: `Seat ${seatId} is held by a different user.`,
      });
    }

    // 2. Find seat tier & price
    const seatDef = INITIAL_SEATS.find((s) => s.id === seatId);
    const price = seatDef ? seatDef.price : 95;
    const tier = seatDef ? seatDef.tier : "PREFERRED";

    // 3. Durable write to Postgres inside transaction with UNIQUE constraint
    const booking = await createBooking({
      eventId,
      seatId,
      userId,
      price,
      tier,
    });

    // 4. Delete Redis hold key
    await redis.del(holdKey);

    // 5. Update velocity & broadcast permanently booked state
    const currentVelocity = recordBookingVelocity();
    io.to(`event:${eventId}`).emit("seat_booked", {
      eventId,
      seatId,
      userId,
      price,
      tier,
      bookedAt: booking.booked_at,
      bookingId: booking.id,
      velocity: currentVelocity,
    });

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (err) {
    if (err.code === "DOUBLE_BOOKING_PREVENTED") {
      return res.status(409).json({
        success: false,
        error: "DOUBLE_BOOKING_PREVENTED",
        message: err.message,
      });
    }
    console.error("Booking error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// REST endpoint for resetting event state (perfect for repeatable demos & tests)
app.post("/api/reset", async (req, res) => {
  const eventId = req.body.eventId || CONFIG.EVENT_ID;
  try {
    const redis = getRedisClient();
    const pattern = `seat:${eventId}:*`;
    const keys = await redis.keys(pattern);
    for (const key of keys) {
      await redis.del(key);
    }
    // Also broadcast reset event to all clients
    io.to(`event:${eventId}`).emit("event_reset", { eventId });
    res.json({ success: true, message: `Reset ${keys.length} holds for event ${eventId}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Handle Keyspace Expiration Events from Redis
redisEvents.on("expired", (expiredKey) => {
  const parsed = parseSeatHoldKey(expiredKey);
  if (parsed) {
    const { eventId, seatId } = parsed;
    console.log(`⏰ [Hold Expired] Seat ${seatId} for event ${eventId} expired naturally via Redis TTL.`);
    io.to(`event:${eventId}`).emit("seat_released", {
      eventId,
      seatId,
      reason: "EXPIRED",
      timestamp: Date.now(),
    });
  }
});

// Socket.io Real-Time Event Handlers
io.on("connection", (socket) => {
  const clientIp = socket.handshake.address;

  // 1. Join Event Room
  socket.on("join_event", async ({ eventId = CONFIG.EVENT_ID, userId }) => {
    socket.join(`event:${eventId}`);
    socket.data.userId = userId;
    socket.data.eventId = eventId;

    // Send full current state to newly joined client
    try {
      const state = await getEventState(eventId, userId);
      socket.emit("initial_state", state);
    } catch (err) {
      console.error("Error sending initial state:", err);
    }
  });

  // Latency Ping-Pong Handler
  socket.on("ping_latency", (callback) => {
    if (callback) callback();
  });

  // 2. Core Hold Seat Request
  socket.on("hold_seat", async ({ eventId = CONFIG.EVENT_ID, seatId, userId, duration = CONFIG.HOLD_DURATION_SECONDS }, callback) => {
    if (!seatId || !userId) {
      if (callback) callback({ success: false, error: "Invalid seatId or userId" });
      return;
    }

    const redis = getRedisClient();
    const holdKey = getSeatHoldKey(eventId, seatId);

    try {
      // Verify not already booked
      const bookings = await getBookingsForEvent(eventId);
      if (bookings.some((b) => b.seat_id === seatId)) {
        const errorPayload = {
          seatId,
          reason: "Seat is already booked permanently.",
        };
        socket.emit("hold_rejected", errorPayload);
        if (callback) callback({ success: false, ...errorPayload });
        return;
      }

      // ATOMIC REDIS SET NX EX
      const result = await redis.set(holdKey, userId, "NX", "EX", duration);

      if (result === "OK") {
        const expiresAt = Date.now() + duration * 1000;
        const payload = {
          eventId,
          seatId,
          userId,
          duration,
          expiresAt,
        };

        // Broadcast to EVERY client in room (including requester)
        io.to(`event:${eventId}`).emit("seat_held", payload);
        if (callback) callback({ success: true, ...payload });
      } else {
        // Lost the race condition: instantaneous rejection
        const errorPayload = {
          seatId,
          reason: "Another user just grabbed this seat milliseconds before you!",
        };
        socket.emit("hold_rejected", errorPayload);
        if (callback) callback({ success: false, ...errorPayload });
      }
    } catch (err) {
      console.error("hold_seat error:", err);
      if (callback) callback({ success: false, error: err.message });
    }
  });

  // 3. Voluntary Release Seat Request
  socket.on("release_seat", async ({ eventId = CONFIG.EVENT_ID, seatId, userId }, callback) => {
    if (!seatId || !userId) return;
    const redis = getRedisClient();
    const holdKey = getSeatHoldKey(eventId, seatId);

    try {
      const currentHolder = await redis.get(holdKey);
      if (currentHolder === userId) {
        await redis.del(holdKey);
        io.to(`event:${eventId}`).emit("seat_released", {
          eventId,
          seatId,
          userId,
          reason: "USER_RELEASED",
          timestamp: Date.now(),
        });
        if (callback) callback({ success: true });
      } else {
        if (callback) callback({ success: false, error: "Not authorized to release" });
      }
    } catch (err) {
      console.error("release_seat error:", err);
      if (callback) callback({ success: false, error: err.message });
    }
  });

  // 4. Confirm Booking Request
  socket.on("confirm_booking", async ({ eventId = CONFIG.EVENT_ID, seatId, userId }, callback) => {
    if (!seatId || !userId) {
      if (callback) callback({ success: false, error: "Invalid seat or user" });
      return;
    }

    const redis = getRedisClient();
    const holdKey = getSeatHoldKey(eventId, seatId);

    try {
      // Verify hold ownership
      const currentHolder = await redis.get(holdKey);
      if (!currentHolder) {
        const errorPayload = {
          seatId,
          error: "HOLD_EXPIRED",
          message: "Hold expired before checkout was completed.",
        };
        socket.emit("booking_failed", errorPayload);
        if (callback) callback({ success: false, ...errorPayload });
        return;
      }

      if (currentHolder !== userId) {
        const errorPayload = {
          seatId,
          error: "HOLD_MISMATCH",
          message: "Seat is no longer held by your session.",
        };
        socket.emit("booking_failed", errorPayload);
        if (callback) callback({ success: false, ...errorPayload });
        return;
      }

      const seatDef = INITIAL_SEATS.find((s) => s.id === seatId);
      const price = seatDef ? seatDef.price : 95;
      const tier = seatDef ? seatDef.tier : "PREFERRED";

      // Durable DB write inside transaction with UNIQUE constraint
      const booking = await createBooking({
        eventId,
        seatId,
        userId,
        price,
        tier,
      });

      // Release hold lock
      await redis.del(holdKey);

      const currentVelocity = recordBookingVelocity();

      const bookingPayload = {
        eventId,
        seatId,
        userId,
        price,
        tier,
        bookedAt: booking.booked_at,
        bookingId: booking.id,
        velocity: currentVelocity,
      };

      // Broadcast to all clients
      io.to(`event:${eventId}`).emit("seat_booked", bookingPayload);
      if (callback) callback({ success: true, booking: bookingPayload });
    } catch (err) {
      console.error("confirm_booking error:", err);
      const errorPayload = {
        seatId,
        error: err.code || "BOOKING_ERROR",
        message: err.message,
      };
      socket.emit("booking_failed", errorPayload);
      if (callback) callback({ success: false, ...errorPayload });
    }
  });

  // 5. BONUS: Live Presence (Hover / Viewing Seat)
  // Ephemeral WebSocket state — never written to Redis, lightweight
  socket.on("viewing_seat", ({ seatId }) => {
    const eventId = socket.data.eventId || CONFIG.EVENT_ID;
    const prevSeatId = socketToSeat.get(socket.id);

    // Remove from previous seat if changed
    if (prevSeatId && prevSeatId !== seatId) {
      const prevSet = seatPresence.get(prevSeatId);
      if (prevSet) {
        prevSet.delete(socket.id);
        if (prevSet.size === 0) seatPresence.delete(prevSeatId);
      }
      socket.to(`event:${eventId}`).emit("presence_updated", {
        seatId: prevSeatId,
        count: prevSet ? prevSet.size : 0,
      });
    }

    if (seatId) {
      socketToSeat.set(socket.id, seatId);
      if (!seatPresence.has(seatId)) {
        seatPresence.set(seatId, new Set());
      }
      seatPresence.get(seatId).add(socket.id);

      // Broadcast to other clients in room (exclude sender)
      socket.to(`event:${eventId}`).emit("presence_updated", {
        seatId,
        count: seatPresence.get(seatId).size,
      });
    }
  });

  socket.on("stop_viewing_seat", ({ seatId }) => {
    const eventId = socket.data.eventId || CONFIG.EVENT_ID;
    socketToSeat.delete(socket.id);
    const set = seatPresence.get(seatId);
    if (set) {
      set.delete(socket.id);
      if (set.size === 0) seatPresence.delete(seatId);
    }
    socket.to(`event:${eventId}`).emit("presence_updated", {
      seatId,
      count: set ? set.size : 0,
    });
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    const prevSeatId = socketToSeat.get(socket.id);
    const eventId = socket.data.eventId || CONFIG.EVENT_ID;
    if (prevSeatId) {
      socketToSeat.delete(socket.id);
      const set = seatPresence.get(prevSeatId);
      if (set) {
        set.delete(socket.id);
        if (set.size === 0) seatPresence.delete(prevSeatId);
        io.to(`event:${eventId}`).emit("presence_updated", {
          seatId: prevSeatId,
          count: set ? set.size : 0,
        });
      }
    }
  });
});

// Periodic reconciler for hold expirations (safety net for client reconnects / edge cases)
setInterval(async () => {
  try {
    const redis = getRedisClient();
    const pattern = `seat:${CONFIG.EVENT_ID}:*`;
    const keys = await redis.keys(pattern);
    for (const key of keys) {
      const ttl = await redis.ttl(key);
      if (ttl <= 0) {
        const parsed = parseSeatHoldKey(key);
        if (parsed) {
          await redis.del(key);
          io.to(`event:${parsed.eventId}`).emit("seat_released", {
            eventId: parsed.eventId,
            seatId: parsed.seatId,
            reason: "EXPIRED",
            timestamp: Date.now(),
          });
        }
      }
    }
  } catch (err) {
    // Suppress periodic scan errors
  }
}, 5000);

// Bootstrap services and start server
async function start() {
  console.log("🚀 Initializing SnapTix Backend Server...");
  await initDb();
  const redisInit = await initRedis();

  // If live Redis with sub is available, configure Socket.io Redis adapter for multi-instance scaling
  if (!redisInit.isMock && redisInit.client && redisInit.sub) {
    try {
      io.adapter(createAdapter(redisInit.client, redisInit.sub));
      console.log("🌐 [Multi-Instance Scalability] Socket.io Redis Adapter enabled across cluster instances!");
    } catch (adapterErr) {
      console.warn("⚠️ [Socket.io Adapter] Could not attach Redis adapter:", adapterErr.message);
    }
  }

  server.listen(CONFIG.PORT, () => {
    console.log(`✅ SnapTix Server running on port ${CONFIG.PORT}`);
    console.log(`📡 WebSocket ready on ws://localhost:${CONFIG.PORT}`);
    console.log(`🩺 Health check at http://localhost:${CONFIG.PORT}/health`);
  });
}

start().catch((err) => {
  console.error("💥 Fatal startup error:", err);
  process.exit(1);
});
