"use client"

import { useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"

import { useAuthStore } from "../../store/authStore"
import { useUiStore } from "../../store/uiStore"
import { Button } from "../ui/Button"

const PAGE_COPY: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Command Center งานจิตเวช",
    subtitle: "ติดตามคิวตรวจ ผู้ป่วยเสี่ยง และงานที่ทีมรักษาต้องจัดการในเวรวันนี้"
  },
  "/appointments": {
    title: "Appointment Operations",
    subtitle: "จัด flow คิว ห้องตรวจ ภาระแพทย์ และการยืนยันนัดให้ลื่นที่สุด"
  },
  "/noshow": {
    title: "Outreach & No-Show",
    subtitle: "จัดลำดับผู้ป่วยที่ต้องติดตามและปิดงาน outreach ให้ครบตามความเสี่ยง"
  },
  "/analytics": {
    title: "Clinical Analytics",
    subtitle: "มองแนวโน้ม no-show ภาระงาน และผลลัพธ์ที่ใช้ตัดสินใจในระดับคลินิก"
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
    <header className="section-card overflow-hidden px-4 py-4 md:px-6 md:py-5 xl:px-7">
      <div className="panel-head gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <button
            className="tap-soft mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border lg:hidden"
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

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">{todayLabel}</span>
              <span className="status-badge status-success">
                <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-current" />
                ระบบพร้อมใช้งาน
              </span>
            </div>
            <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.04em] md:text-[34px]">{pageCopy.title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 md:text-[15px]" style={{ color: "var(--ink-muted)" }}>
              {pageCopy.subtitle}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          {user ? (
            <div className="surface-strong flex min-w-0 items-center gap-3 rounded-[22px] px-3 py-2.5">
              <div
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-strong) 100%)" }}
              >
                {user.firstName?.charAt(0) ?? "?"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-xs" style={{ color: "var(--ink-muted)" }}>
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
      </div>
    </header>
  )
}
