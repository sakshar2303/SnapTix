-- SnapTix Postgres Schema
-- Durable system-of-record for finalized bookings
-- Survives Redis restarts and server deployments

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

CREATE INDEX IF NOT EXISTS idx_bookings_event ON bookings (event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings (user_id);
