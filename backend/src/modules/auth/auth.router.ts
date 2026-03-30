import { Router } from "express"
import rateLimit from "express-rate-limit"

import { authenticate } from "../../middleware/auth"
import { validate } from "../../middleware/validate"
import { authService } from "./auth.service"
import { loginSchema, refreshTokenSchema } from "./auth.schema"

export const authRouter = Router()

// จำกัด 10 ครั้ง / 15 นาที ต่อ IP สำหรับ login และ refresh
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { code: "RATE_LIMITED", message: "พยายามเข้าสู่ระบบมากเกินไป กรุณารอ 15 นาที" }
})

authRouter.post("/login", authLimiter, validate(loginSchema), async (request, response) => {
  const result = await authService.login(request.body)
  response.json({
    data: result
  })
})

authRouter.post("/refresh", authLimiter, validate(refreshTokenSchema), async (request, response) => {
  const result = await authService.refresh(request.body)
  response.json({
    data: result
  })
})

authRouter.post("/logout", authenticate, async (request, response) => {
  await authService.logout(request.user!.userId, request.user!.sessionId)
  response.json({
    data: true,
    message: "ออกจากระบบสำเร็จ"
  })
})

authRouter.get("/me", authenticate, async (request, response) => {
  const result = await authService.me(request.user!.userId)
  response.json({
    data: result
  })
})
