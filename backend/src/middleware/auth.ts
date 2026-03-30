import jwt from "jsonwebtoken"
import type { Role } from "@prisma/client"
import type { NextFunction, Request, Response } from "express"

import { env } from "../config/env"
import { ApiError } from "../utils/apiError"

// Supabase JWT payload structure
interface SupabaseJWTPayload {
  sub: string
  email?: string
  session_id?: string
  user_metadata?: {
    role?: string
    first_name?: string
    last_name?: string
  }
  role: string // Supabase DB role — always "authenticated", not the app role
  aud: string | string[]
  exp: number
  iat: number
}

const VALID_ROLES: Role[] = ["NURSE", "DOCTOR", "MANAGER", "ADMIN"]

function toAppRole(raw: string | undefined): Role {
  if (raw && VALID_ROLES.includes(raw as Role)) {
    return raw as Role
  }
  return "NURSE"
}

export const authenticate = (request: Request, _response: Response, next: NextFunction) => {
  const authorization = request.headers.authorization

  if (!authorization?.startsWith("Bearer ")) {
    return next(new ApiError(401, "AUTH_REQUIRED", "กรุณาเข้าสู่ระบบ"))
  }

  const token = authorization.replace("Bearer ", "").trim()

  try {
    // ตรวจสอบ Supabase JWT ด้วย SUPABASE_JWT_SECRET
    const payload = jwt.verify(token, env.SUPABASE_JWT_SECRET) as SupabaseJWTPayload

    request.user = {
      userId: payload.sub,
      username: payload.email ?? payload.sub,
      role: toAppRole(payload.user_metadata?.role),
      sessionId: payload.session_id ?? ""
    }

    return next()
  } catch {
    return next(new ApiError(401, "INVALID_TOKEN", "โทเคนไม่ถูกต้องหรือหมดอายุ"))
  }
}
