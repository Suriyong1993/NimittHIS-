import { create } from "zustand"

import type { AuthUser, LoginPayload } from "../api/auth"
import { supabase } from "../lib/supabase"

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  loginAction: (payload: LoginPayload) => Promise<void>
  bootstrap: () => Promise<void>
  logout: () => Promise<void>
}

function mapUser(user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }): AuthUser {
  return {
    id: user.id,
    email: user.email ?? "",
    firstName: String(user.user_metadata?.first_name ?? "ผู้ใช้"),
    lastName: String(user.user_metadata?.last_name ?? "ระบบ"),
    role: String(user.user_metadata?.role ?? "NURSE") as AuthUser["role"]
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isBootstrapping: true,
  async loginAction(payload) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password
    })

    if (error || !data.user) {
      throw error ?? new Error("Login failed")
    }

    set({
      user: mapUser(data.user),
      isAuthenticated: true
    })
  },
  async bootstrap() {
    const { data } = await supabase.auth.getSession()

    if (!data.session?.user) {
      set({
        user: null,
        isAuthenticated: false,
        isBootstrapping: false
      })
      return
    }

    set({
      user: mapUser(data.session.user),
      isAuthenticated: true,
      isBootstrapping: false
    })
  },
  async logout() {
    await supabase.auth.signOut()
    set({
      user: null,
      isAuthenticated: false,
      isBootstrapping: false
    })
  }
}))
