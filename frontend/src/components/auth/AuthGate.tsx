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
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          {/* Animated logo */}
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-[22px] bg-nimitt-blue/10 animate-pulse-soft" />
            <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-nimitt-blue shadow-md">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            {/* Spinner ring */}
            <svg
              className="absolute inset-0 animate-spin-slow"
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
            >
              <circle cx="32" cy="32" r="28" stroke="#2563EB" strokeWidth="2" strokeDasharray="44 132" strokeLinecap="round" />
            </svg>
          </div>

          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-nimitt-faint">NimittHIS</p>
            <p className="mt-2 text-sm text-nimitt-muted">กำลังเตรียมระบบ...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
