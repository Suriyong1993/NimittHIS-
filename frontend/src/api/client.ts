import axios, { AxiosError } from "axios"

import { supabase } from "../lib/supabase"
import { useAuthStore } from "../store/authStore"

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001/api"
})

let refreshPromise: Promise<string | null> | null = null

apiClient.interceptors.request.use(async (config) => {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ code?: string }>) => {
    const originalRequest = error.config
    if (!originalRequest) {
      return Promise.reject(error)
    }

    if (error.response?.status !== 401 || originalRequest.headers?.["x-retried"]) {
      return Promise.reject(error)
    }

    if (!refreshPromise) {
      refreshPromise = supabase.auth
        .refreshSession()
        .then(({ data }) => data.session?.access_token ?? null)
    }

    const token = await refreshPromise
    refreshPromise = null

    if (!token) {
      await useAuthStore.getState().logout()
      return Promise.reject(error)
    }

    originalRequest.headers.Authorization = `Bearer ${token}`
    originalRequest.headers["x-retried"] = "true"
    return apiClient(originalRequest)
  }
)

export { apiClient }
