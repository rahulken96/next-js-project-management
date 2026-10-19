// lib/redis.ts
import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redis =
  globalForRedis.redis ??
  new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      // Hentikan reconnect berlebih jika Redis offline
      if (times > 3) return null;
      return Math.min(times * 100, 2000);
    },
  });

redis.on("error", (err) => {
  // Hanya catat log, jangan lempar fatal exception!
  console.warn("⚠️ Redis Connection Issue:", err.message);
});

if (process.env.NODE_ENV != "production") {
  globalForRedis.redis = redis;
}