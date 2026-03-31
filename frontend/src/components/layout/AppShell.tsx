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

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname, setSidebarOpen])

  return (
    <div className="min-h-screen px-3 py-3 md:px-5 md:py-5">
      <div className="page-shell grid min-h-[calc(100vh-1.5rem)] gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <div className="sticky top-5 h-[calc(100vh-2.5rem)]">
            <Sidebar />
          </div>
        </div>

        {sidebarOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-[#173029]/20 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-3 top-3 h-[calc(100%-1.5rem)] w-[86vw] max-w-[320px]">
              <Sidebar />
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-col gap-5">
          <TopBar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
