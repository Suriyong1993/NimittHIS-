import { Router } from "express"

import { authenticate } from "../../middleware/auth"
import { validate } from "../../middleware/validate"
import { authService } from "./auth.service"
import { loginSchema, refreshTokenSchema } from "./auth.schema"

export const authRouter = Router()

authRouter.post("/login", validate(loginSchema), async (request, response) => {
  const result = await authService.login(request.body)
  response.json({
    data: result
  })
})

authRouter.post("/refresh", validate(refreshTokenSchema), async (request, response) => {
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
