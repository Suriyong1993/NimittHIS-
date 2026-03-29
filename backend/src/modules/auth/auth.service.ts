import { Role, type User } from "@prisma/client"
import bcrypt from "bcryptjs"
import { randomUUID } from "crypto"

import { prisma } from "../../config/database"
import { redis } from "../../config/redis"
import { ApiError } from "../../utils/apiError"
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  type AccessTokenPayload
} from "../../utils/jwt"
import type { LoginDto, RefreshTokenDto } from "./auth.schema"

interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    username: string
    firstName: string
    lastName: string
    role: Role
  }
}

const buildSessionKey = (userId: string, sessionId: string) => `refresh:${userId}:${sessionId}`

const sanitizeUser = (user: User) => ({
  id: user.id,
  username: user.username,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role
})

export class AuthService {
  async login(payload: LoginDto): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { username: payload.username }
    })

    if (!user || !user.isActive) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง")
    }

    const passwordMatches = await bcrypt.compare(payload.password, user.passwordHash)

    if (!passwordMatches) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง")
    }

    const sessionId = randomUUID()
    const accessPayload: AccessTokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      sessionId
    }

    const refreshToken = signRefreshToken({
      userId: user.id,
      sessionId
    })

    await redis.set(buildSessionKey(user.id, sessionId), refreshToken, "EX", 60 * 60 * 24 * 7)

    return {
      accessToken: signAccessToken(accessPayload),
      refreshToken,
      user: sanitizeUser(user)
    }
  }

  async refresh(payload: RefreshTokenDto): Promise<{ accessToken: string }> {
    const decoded = verifyRefreshToken(payload.refreshToken)
    const redisKey = buildSessionKey(decoded.userId, decoded.sessionId)
    const storedToken = await redis.get(redisKey)

    if (!storedToken || storedToken !== payload.refreshToken) {
      throw new ApiError(401, "INVALID_REFRESH_TOKEN", "ไม่สามารถต่ออายุเซสชันได้")
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || !user.isActive) {
      throw new ApiError(401, "USER_NOT_FOUND", "ไม่พบผู้ใช้งาน")
    }

    return {
      accessToken: signAccessToken({
        userId: user.id,
        username: user.username,
        role: user.role,
        sessionId: decoded.sessionId
      })
    }
  }

  async logout(userId: string, sessionId: string): Promise<void> {
    await redis.del(buildSessionKey(userId, sessionId))
  }

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new ApiError(404, "USER_NOT_FOUND", "ไม่พบข้อมูลผู้ใช้งาน")
    }

    return sanitizeUser(user)
  }
}

export const authService = new AuthService()
