import Redis from "ioredis"

import { env } from "./env"

declare global {
  var __nimitthisRedis: Redis | undefined
}

export const redis =
  global.__nimitthisRedis ??
  new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true
  })

if (process.env.NODE_ENV !== "production") {
  global.__nimitthisRedis = redis
}
