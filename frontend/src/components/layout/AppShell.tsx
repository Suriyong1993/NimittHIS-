import type { PropsWithChildren } from "react"

import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-nimitt-bg p-4 md:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1600px] gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <TopBar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  )
}
