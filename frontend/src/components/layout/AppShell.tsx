"use client"

import type { PropsWithChildren } from "react"
import { useEffect } from "react"
import { usePathname } from "next/navigation"

import { useUiStore } from "../../store/uiStore"
import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"

export function AppShell({ children }: PropsWithChildren) {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen)
  const pathname = usePathname()

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname, setSidebarOpen])

  return (
    <div className="min-h-screen p-3 md:p-5" style={{ background: "#0d0f1a" }}>
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1600px] gap-5 lg:grid-cols-[272px_minmax(0,1fr)]">

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-5 h-[calc(100vh-2.5rem)]">
            <Sidebar />
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 animate-fade-in"
              style={{ background: "rgba(13,15,26,0.75)", backdropFilter: "blur(8px)" }}
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer */}
            <div className="absolute left-0 top-0 h-full w-72 animate-slide-in-left p-3">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex min-w-0 flex-col gap-5">
          <TopBar />
          <main className="min-w-0 flex-1 animate-slide-up">{children}</main>
        </div>
      </div>
    </div>
  )
}
