export interface LoginPayload {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "NURSE" | "DOCTOR" | "MANAGER" | "ADMIN"
}
