import type { Role } from "@prisma/client"
import type { NextFunction, Request, Response } from "express"

import { ApiError } from "../utils/apiError"

export const authorize =
  (...roles: Role[]) =>
  (request: Request, _response: Response, next: NextFunction) => {
    if (!request.user) {
      return next(new ApiError(401, "AUTH_REQUIRED", "กรุณาเข้าสู่ระบบ"))
    }

    if (!roles.includes(request.user.role)) {
      return next(new ApiError(403, "FORBIDDEN", "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้"))
    }

    return next()
  }
