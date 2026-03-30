import { create } from "zustand"
import type { AuthChangeEvent, User } from "@supabase/supabase-js"

import type { AuthUser, LoginPayload } from "../api/auth"
import { getSupabaseClient } from "../lib/supabase"

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  isReady: boolean
  loginAction: (payload: LoginPayload) => Promise<void>
  registerAction: (payload: LoginPayload) => Promise<void>
  bootstrap: () => Promise<void>
  syncSession: (event: AuthChangeEvent, user: User | null) => void
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
  isReady: false,
  async loginAction(payload) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password
    })

    if (error || !data.user) {
      throw error ?? new Error("Login failed")
    }

    set({
      user: mapUser(data.user),
      isAuthenticated: true,
      isBootstrapping: false,
      isReady: true
    })
  },
  async registerAction(payload) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: { role: 'NURSE' }
      }
    })

    if (error) {
      throw error
    }

    if (data.session && data.user) {
      set({
        user: mapUser(data.user),
        isAuthenticated: true,
        isBootstrapping: false,
        isReady: true
      })
    }
  },
  async bootstrap() {
    const supabase = getSupabaseClient()
    const { data } = await supabase.auth.getSession()

    if (!data.session?.user) {
      set({
        user: null,
        isAuthenticated: false,
        isBootstrapping: false,
        isReady: true
      })
      return
    }

    set({
      user: mapUser(data.session.user),
      isAuthenticated: true,
      isBootstrapping: false,
      isReady: true
    })
  },
  syncSession(_event, user) {
    set({
      user: user ? mapUser(user) : null,
      isAuthenticated: Boolean(user),
      isBootstrapping: false,
      isReady: true
    })
  },
  async logout() {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    set({
      user: null,
      isAuthenticated: false,
      isBootstrapping: false,
      isReady: true
    })
  }
}))
