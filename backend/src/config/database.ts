import { PrismaClient } from "@prisma/client"

declare global {
  var __nimitthisPrisma: PrismaClient | undefined
}

export const prisma =
  global.__nimitthisPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"]
  })

if (process.env.NODE_ENV !== "production") {
  global.__nimitthisPrisma = prisma
}
