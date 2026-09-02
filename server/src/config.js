import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 4000,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  REDIS_URL: process.env.REDIS_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  HOLD_DURATION_SECONDS: parseInt(process.env.HOLD_DURATION_SECONDS || "300", 10), // 5 minutes default
  EVENT_ID: process.env.EVENT_ID || "venue-synth-lab",
};
