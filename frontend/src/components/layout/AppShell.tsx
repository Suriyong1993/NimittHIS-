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
    <div className="relative min-h-screen" style={{ background: "#030712" }}>
      {/* Aurora background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 900, height: 900,
            top: -300, left: -150,
            background: "radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%)",
            animation: "auroraA 22s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 700, height: 700,
            bottom: -150, right: -150,
            background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)",
            animation: "auroraB 28s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,179,237,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,0.025) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Layout */}
      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 shrink-0 h-full overflow-y-auto">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-64" style={{ zIndex: 51 }}>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Right column */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="h-[60px] shrink-0">
            <TopBar />
          </div>
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>

      <style jsx global>{`
        @keyframes auroraA { from { transform: translate(0,0) } to { transform: translate(120px,90px) } }
        @keyframes auroraB { from { transform: translate(0,0) } to { transform: translate(-90px,-70px) } }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,179,237,0.2); border-radius: 999px; }
      `}</style>
    </div>
  )
}
