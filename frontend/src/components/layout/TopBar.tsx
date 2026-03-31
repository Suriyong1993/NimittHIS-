"use client"

import { useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"

import { useAuthStore } from "../../store/authStore"
import { useUiStore } from "../../store/uiStore"
import { Button } from "../ui/Button"

const PAGE_COPY: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "ภาพรวมเวรจิตเวช",
    subtitle: "ติดตามผู้ป่วย นัดหมายที่ต้องดูแล และความเคลื่อนไหวของคลินิกในวันนี้"
  },
  "/appointments": {
    title: "ตารางนัดหมาย",
    subtitle: "ดูคิวตรวจ ยืนยันการมา และประสานงานระหว่างทีมแพทย์กับพยาบาล"
  },
  "/noshow": {
    title: "ติดตามขาดนัด",
    subtitle: "คัดกรองผู้ป่วยเสี่ยงสูงและจัดลำดับการติดตามเชิงรุก"
  },
  "/analytics": {
    title: "วิเคราะห์ผลลัพธ์",
    subtitle: "สรุปตัวชี้วัดที่ช่วยให้ทีมบริหารและทีมรักษาตัดสินใจได้มั่นใจขึ้น"
  }
}

function formatThaiDate(date: Date) {
  return date.toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  })
}

export function TopBar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen)

  const pageCopy = useMemo(() => PAGE_COPY[pathname ?? "/dashboard"] ?? PAGE_COPY["/dashboard"], [pathname])
  const todayLabel = useMemo(() => formatThaiDate(new Date()), [])

  return (
    <header className="section-card flex flex-wrap items-start justify-between gap-5 px-5 py-5 lg:px-7">
      <div className="flex items-start gap-3">
        <button
          className="tap-soft mt-1 inline-flex h-11 w-11 items-center justify-center rounded-2xl border lg:hidden"
          style={{ background: "var(--surface-strong)", borderColor: "var(--line)" }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="เปิดหรือปิดเมนู"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--brand)" }}>
            {todayLabel}
          </p>
          <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.03em]">{pageCopy.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7" style={{ color: "var(--ink-muted)" }}>
            {pageCopy.subtitle}
          </p>
        </div>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-3">
        <div className="status-badge status-success">
          <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-current" />
          ระบบพร้อมใช้งาน
        </div>

        {user ? (
          <div className="surface-strong flex items-center gap-3 rounded-[22px] px-3 py-2">
            <div
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-strong) 100%)" }}
            >
              {user.firstName?.charAt(0) ?? "?"}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs" style={{ color: "var(--ink-muted)" }}>
                {user.email}
              </p>
            </div>
          </div>
        ) : null}

        <Button
          variant="secondary"
          className="rounded-[18px] border-0 px-5 py-3 text-xs font-semibold"
          style={{ background: "var(--danger-soft)", color: "var(--danger)" }}
          onClick={async () => {
            await logout()
            router.replace("/login")
          }}
        >
          ออกจากระบบ
        </Button>
      </div>
    </header>
  )
}
