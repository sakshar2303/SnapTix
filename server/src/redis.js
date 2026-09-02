import Redis from "ioredis";
import { EventEmitter } from "events";

export const redisEvents = new EventEmitter();

let redisClient = null;
let redisSub = null;
let isMock = false;

// Atomic in-memory Redis emulator with exact NX EX semantics and expiration events
class MockRedisClient extends EventEmitter {
  constructor() {
    super();
    this.store = new Map(); // key -> { value, expiresAt }
    this.timers = new Map(); // key -> timeoutId
  }

  async set(key, value, mode, expireMode, expireSeconds) {
    const now = Date.now();
    const existing = this.store.get(key);

    // If key exists and hasn't expired
    if (existing && existing.expiresAt > now) {
      if (mode === "NX") {
        return null; // Key already exists, NX fails
      }
    }

    // Clean up existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }

    const ttlMs = expireSeconds ? expireSeconds * 1000 : 300 * 1000;
    const expiresAt = now + ttlMs;

    this.store.set(key, { value, expiresAt });

    // Schedule expiration event
    const timer = setTimeout(() => {
      if (this.store.has(key)) {
        this.store.delete(key);
        this.timers.delete(key);
        // Emit Redis keyspace expired event
        redisEvents.emit("expired", key);
      }
    }, ttlMs);

    // Do not hold process alive purely for hold timers
    if (timer.unref) timer.unref();
    this.timers.set(key, timer);

    return "OK";
  }

  async get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.del(key);
      return null;
    }
    return item.value;
  }

  async del(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    const existed = this.store.delete(key);
    return existed ? 1 : 0;
  }

  async ttl(key) {
    const item = this.store.get(key);
    if (!item) return -2;
    const remaining = Math.round((item.expiresAt - Date.now()) / 1000);
    return remaining > 0 ? remaining : -2;
  }

  async keys(pattern) {
    const now = Date.now();
    const prefix = pattern.replace("*", "");
    const results = [];
    for (const [key, item] of this.store.entries()) {
      if (item.expiresAt > now && key.startsWith(prefix)) {
        results.push(key);
      }
    }
    return results;
  }
}

export async function initRedis() {
  const redisUrl = process.env.REDIS_URL;

  if (redisUrl) {
    try {
      console.log("🔄 [Redis] Connecting to external Redis (Upstash/Redis)...");
      redisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        connectTimeout: 5000,
      });

      redisSub = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        connectTimeout: 5000,
      });

      await redisClient.ping();
      console.log("⚡ [Redis] Successfully connected to live Redis instance");

      // Attempt to enable keyspace notifications (may be disabled by default on some providers)
      try {
        await redisClient.config("SET", "notify-keyspace-events", "KEx");
        console.log("📢 [Redis] Keyspace events enabled (KEx)");
      } catch (cfgErr) {
        console.warn("⚠️ [Redis] Could not set notify-keyspace-events via CONFIG (normal for managed cloud Redis like Upstash):", cfgErr.message);
      }

      // Subscribe to keyspace expiration notifications
      // Pattern: __keyevent@*__:expired
      await redisSub.psubscribe("__keyevent@*__:expired");
      redisSub.on("pmessage", (pattern, channel, expiredKey) => {
        redisEvents.emit("expired", expiredKey);
      });

      isMock = false;
      return { client: redisClient, sub: redisSub, isMock: false };
    } catch (err) {
      console.warn("⚠️ [Redis] Connection failed to REDIS_URL:", err.message);
      console.warn("⚠️ [Redis] Falling back to high-concurrency in-memory atomic Redis engine.");
      isMock = true;
      redisClient = new MockRedisClient();
      return { client: redisClient, isMock: true };
    }
  } else {
    console.log("ℹ️ [Redis] No REDIS_URL provided. Initialized built-in atomic Redis engine with SET NX EX & TTL.");
    isMock = true;
    redisClient = new MockRedisClient();
    return { client: redisClient, isMock: true };
  }
}

export function getRedisClient() {
  if (!redisClient) {
    redisClient = new MockRedisClient();
    isMock = true;
  }
  return redisClient;
}

export function getRedisSub() {
  return redisSub;
}

export function isRedisMock() {
  return isMock;
}
