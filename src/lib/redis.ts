import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

declare global {
  // eslint-disable-next-line no-var
  var __jobhunt_redis__: Redis | undefined;
}

export function getRedisClient(): Redis {
  if (!globalThis.__jobhunt_redis__) {
    globalThis.__jobhunt_redis__ = new Redis(REDIS_URL, {
      lazyConnect: true,
    });
  }

  return globalThis.__jobhunt_redis__;
}

export function getRedisConnectionOptions() {
  return {
    url: REDIS_URL,
  };
}
