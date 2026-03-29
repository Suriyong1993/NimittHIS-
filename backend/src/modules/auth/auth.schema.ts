import { z } from "zod"

export const loginSchema = z.object({
  username: z.string().min(3, "กรุณากรอกชื่อผู้ใช้"),
  password: z.string().min(4, "กรุณากรอกรหัสผ่าน")
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "กรุณาระบุ refresh token")
})

export type LoginDto = z.infer<typeof loginSchema>
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>
