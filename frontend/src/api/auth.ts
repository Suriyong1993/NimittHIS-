import { apiClient } from "./client"

export interface LoginPayload {
  username: string
  password: string
}

export interface AuthUser {
  id: string
  username: string
  firstName: string
  lastName: string
  role: "NURSE" | "DOCTOR" | "MANAGER" | "ADMIN"
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export async function login(payload: LoginPayload) {
  const response = await apiClient.post<{ data: LoginResponse }>("/auth/login", payload)
  return response.data.data
}

export async function refreshToken(refreshTokenValue: string) {
  const response = await apiClient.post<{ data: { accessToken: string } }>("/auth/refresh", {
    refreshToken: refreshTokenValue
  })

  return response.data.data.accessToken
}

export async function getCurrentUser() {
  const response = await apiClient.get<{ data: AuthUser }>("/auth/me")
  return response.data.data
}
