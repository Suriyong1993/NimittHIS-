"use client"

import { type PropsWithChildren, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { useAuthStore } from "@/store/authStore"

export function AuthGate({ children }: PropsWithChildren) {
  const router = useRouter()
  const pathname = usePathname()
  const safePathname = pathname ?? "/dashboard"
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping)
  const isReady = useAuthStore((state) => state.isReady)

  useEffect(() => {
    if (!isBootstrapping && isReady && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(safePathname)}`)
    }
  }, [isAuthenticated, isBootstrapping, isReady, router, safePathname])

  if (isBootstrapping || !isReady) {
    return (
      <main className="grid min-h-screen place-items-center bg-nimitt-bg">
        <div className="rounded-3xl border border-nimitt-border bg-white px-6 py-4 text-sm text-nimitt-muted">
          กำลังเตรียมระบบ...
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
