import type { PropsWithChildren } from "react"

import { AuthGate } from "@/components/auth/AuthGate"
import { AppShell } from "@/components/layout/AppShell"

export default function ProtectedLayout({ children }: PropsWithChildren) {
  return (
    <AuthGate>
      <AppShell>{children}</AppShell>
    </AuthGate>
  )
}
