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
    <div className="min-h-screen px-2 py-2 md:px-4 md:py-4 xl:px-5 xl:py-5">
      <div className="page-shell grid min-h-[calc(100vh-1rem)] gap-4 lg:grid-cols-[312px_minmax(0,1fr)] xl:gap-5">
        <div className="hidden lg:block">
          <div className="sticky top-4 h-[calc(100vh-2rem)] xl:top-5 xl:h-[calc(100vh-2.5rem)]">
            <Sidebar />
          </div>
        </div>

        {sidebarOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-[#0f2738]/30 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-2 top-2 h-[calc(100%-1rem)] w-[88vw] max-w-[320px] md:left-4 md:top-4 md:h-[calc(100%-2rem)]">
              <Sidebar />
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-col gap-4 xl:gap-5">
          <TopBar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
