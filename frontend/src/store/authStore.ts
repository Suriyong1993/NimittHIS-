import { create } from "zustand"

import {
  getCurrentUser,
  login,
  refreshToken,
  type AuthUser,
  type LoginPayload
} from "../api/auth"

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshTokenValue: string | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  loginAction: (payload: LoginPayload) => Promise<void>
  refreshSession: () => Promise<string | null>
  bootstrap: () => Promise<void>
  logout: () => void
}

const storageKey = "nimitthis-auth"

const loadPersistedState = () => {
  const raw = window.localStorage.getItem(storageKey)
  if (!raw) {
    return {
      accessToken: null,
      refreshTokenValue: null
    }
  }

  try {
    const parsed = JSON.parse(raw) as { accessToken?: string; refreshTokenValue?: string }
    return {
      accessToken: parsed.accessToken ?? null,
      refreshTokenValue: parsed.refreshTokenValue ?? null
    }
  } catch {
    return {
      accessToken: null,
      refreshTokenValue: null
    }
  }
}

const persistState = (accessToken: string | null, refreshTokenValue: string | null) => {
  window.localStorage.setItem(
    storageKey,
    JSON.stringify({
      accessToken,
      refreshTokenValue
    })
  )
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isBootstrapping: true,
  ...loadPersistedState(),
  async loginAction(payload) {
    const result = await login(payload)
    persistState(result.accessToken, result.refreshToken)
    set({
      user: result.user,
      accessToken: result.accessToken,
      refreshTokenValue: result.refreshToken,
      isAuthenticated: true
    })
  },
  async refreshSession() {
    const currentRefreshToken = get().refreshTokenValue
    if (!currentRefreshToken) {
      return null
    }

    try {
      const nextAccessToken = await refreshToken(currentRefreshToken)
      persistState(nextAccessToken, currentRefreshToken)
      set({
        accessToken: nextAccessToken,
        isAuthenticated: true
      })
      return nextAccessToken
    } catch {
      get().logout()
      return null
    }
  },
  async bootstrap() {
    if (!get().accessToken || !get().refreshTokenValue) {
      set({
        isBootstrapping: false,
        isAuthenticated: false
      })
      return
    }

    try {
      const profile = await getCurrentUser()
      set({
        user: profile,
        isAuthenticated: true,
        isBootstrapping: false
      })
    } catch {
      const token = await get().refreshSession()
      if (!token) {
        set({
          isBootstrapping: false
        })
        return
      }

      const profile = await getCurrentUser()
      set({
        user: profile,
        isAuthenticated: true,
        isBootstrapping: false
      })
    }
  },
  logout() {
    persistState(null, null)
    set({
      user: null,
      accessToken: null,
      refreshTokenValue: null,
      isAuthenticated: false,
      isBootstrapping: false
    })
  }
}))
