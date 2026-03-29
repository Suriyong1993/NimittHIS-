import type { Role } from "@prisma/client"

declare global {
  namespace Express {
    interface UserSession {
      userId: string
      username: string
      role: Role
      sessionId: string
    }

    interface Request {
      user?: UserSession
    }
  }
}

export {}
