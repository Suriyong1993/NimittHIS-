import jwt, { type SignOptions } from "jsonwebtoken"

import { env } from "../config/env"

export interface AccessTokenPayload {
  userId: string
  username: string
  role: string
  sessionId: string
}

export interface RefreshTokenPayload {
  userId: string
  sessionId: string
}

const accessOptions: SignOptions = {
  expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
}

const refreshOptions: SignOptions = {
  expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]
}

export const signAccessToken = (payload: AccessTokenPayload): string =>
  jwt.sign(payload, env.JWT_SECRET, accessOptions)

export const signRefreshToken = (payload: RefreshTokenPayload): string =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, refreshOptions)

export const verifyAccessToken = (token: string): AccessTokenPayload =>
  jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload

export const verifyRefreshToken = (token: string): RefreshTokenPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload
