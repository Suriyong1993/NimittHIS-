"use client"

import { type PropsWithChildren, useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { getSupabaseClient } from "@/lib/supabase"
import { useAuthStore } from "@/store/authStore"

export function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient())
  const bootstrap = useAuthStore((state) => state.bootstrap)
  const syncSession = useAuthStore((state) => state.syncSession)

  useEffect(() => {
    void bootstrap()
    const supabase = getSupabaseClient()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      syncSession(event, session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [bootstrap, syncSession])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
