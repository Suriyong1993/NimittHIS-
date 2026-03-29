import type { NextFunction, Request, Response } from "express"

import { verifyAccessToken } from "../utils/jwt"
import { ApiError } from "../utils/apiError"

export const authenticate = (request: Request, _response: Response, next: NextFunction) => {
  const authorization = request.headers.authorization

  if (!authorization?.startsWith("Bearer ")) {
    return next(new ApiError(401, "AUTH_REQUIRED", "กรุณาเข้าสู่ระบบ"))
  }

  const token = authorization.replace("Bearer ", "").trim()

  try {
    const payload = verifyAccessToken(token)
    request.user = {
      userId: payload.userId,
      username: payload.username,
      role: payload.role as Express.UserSession["role"],
      sessionId: payload.sessionId
    }

    return next()
  } catch {
    return next(new ApiError(401, "INVALID_TOKEN", "โทเคนไม่ถูกต้องหรือหมดอายุ"))
  }
}
