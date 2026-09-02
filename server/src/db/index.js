import pg from "pg";
import { randomUUID } from "crypto";

const { Pool } = pg;

let pool = null;
let isInMemoryFallback = false;

// In-memory table representation for local zero-config fallback
const inMemoryBookings = new Map(); // key: `${eventId}:${seatId}` -> booking object

export async function initDb() {
  const connectionString = process.env.DATABASE_URL;

  if (connectionString) {
    try {
      pool = new Pool({
        connectionString,
        ssl: connectionString.includes("localhost")
          ? false
          : { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });

      // Verify connection
      const client = await pool.connect();
      console.log("📦 [Postgres] Connected to durable database (Neon/Postgres)");

      // Run schema migration
      await client.query(`
        CREATE TABLE IF NOT EXISTS bookings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          event_id VARCHAR(64) NOT NULL,
          seat_id VARCHAR(16) NOT NULL,
          user_id VARCHAR(64) NOT NULL,
          price NUMERIC(10, 2) NOT NULL,
          tier VARCHAR(32) NOT NULL,
          booked_at TIMESTAMPTZ DEFAULT NOW(),
          CONSTRAINT unique_event_seat UNIQUE (event_id, seat_id)
        );
      `);
      client.release();
      isInMemoryFallback = false;
      return true;
    } catch (err) {
      console.warn("⚠️ [Postgres] Failed to connect to DATABASE_URL:", err.message);
      console.warn("⚠️ [Postgres] Falling back to atomic in-memory DB store for local testing.");
      isInMemoryFallback = true;
      return false;
    }
  } else {
    console.log("ℹ️ [Postgres] No DATABASE_URL provided. Using in-memory relational store with UNIQUE constraints.");
    isInMemoryFallback = true;
    return true;
  }
}

export async function createBooking({ eventId, seatId, userId, price, tier }) {
  if (!isInMemoryFallback && pool) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const insertQuery = `
        INSERT INTO bookings (event_id, seat_id, user_id, price, tier)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const res = await client.query(insertQuery, [
        eventId,
        seatId,
        userId,
        price,
        tier,
      ]);

      await client.query("COMMIT");
      return res.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      // Postgres error code 23505 = unique_violation
      if (err.code === "23505") {
        const conflictErr = new Error(`Seat ${seatId} is already booked in database`);
        conflictErr.code = "DOUBLE_BOOKING_PREVENTED";
        throw conflictErr;
      }
      throw err;
    } finally {
      client.release();
    }
  } else {
    // In-memory store with atomic check & set
    const key = `${eventId}:${seatId}`;
    if (inMemoryBookings.has(key)) {
      const conflictErr = new Error(`Seat ${seatId} is already booked in database`);
      conflictErr.code = "DOUBLE_BOOKING_PREVENTED";
      throw conflictErr;
    }

    const booking = {
      id: randomUUID(),
      event_id: eventId,
      seat_id: seatId,
      user_id: userId,
      price,
      tier,
      booked_at: new Date().toISOString(),
    };
    inMemoryBookings.set(key, booking);
    return booking;
  }
}

export async function getBookingsForEvent(eventId) {
  if (!isInMemoryFallback && pool) {
    const res = await pool.query(
      "SELECT * FROM bookings WHERE event_id = $1 ORDER BY booked_at ASC",
      [eventId]
    );
    return res.rows;
  } else {
    return Array.from(inMemoryBookings.values()).filter(
      (b) => b.event_id === eventId
    );
  }
}

export function isUsingFallback() {
  return isInMemoryFallback;
}
