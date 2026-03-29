import dotenv from "dotenv"
import path from "path"
import { z } from "zod"

dotenv.config({
  path: path.resolve(process.cwd(), ".env")
})
dotenv.config({
  path: path.resolve(process.cwd(), "..", ".env"),
  override: false
})

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  FRONTEND_URL: z.string().default("http://localhost:5173"),
  TWILIO_ACCOUNT_SID: z.string().optional().default(""),
  TWILIO_AUTH_TOKEN: z.string().optional().default(""),
  TWILIO_FROM_NUMBER: z.string().optional().default("")
})

export const env = envSchema.parse(process.env)
