"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { useAuthStore } from "../../store/authStore"
import { useUiStore } from "../../store/uiStore"
import { Button } from "../ui/Button"

const THAI_DAYS   = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"]
const THAI_MONTHS = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
                     "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"]

function getThaiDate(d: Date) {
  return `วัน${THAI_DAYS[d.getDay()]}ที่ ${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`
}

function getGreeting(hour: number) {
  if (hour < 12) return "อรุณสวัสดิ์"
  if (hour < 17) return "สวัสดีตอนบ่าย"
  return "สวัสดีตอนเย็น"
}

export function TopBar() {
  const router           = useRouter()
  const { user, logout } = useAuthStore()
  const setSidebarOpen   = useUiStore((s) => s.setSidebarOpen)
  const sidebarOpen      = useUiStore((s) => s.sidebarOpen)

  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <header
      className="animate-fade-in flex items-center justify-between gap-4 px-5 py-3.5"
      style={{
        background: "rgba(13,15,26,0.65)",
        backdropFilter: "blur(20px) saturate(120%)",
        WebkitBackdropFilter: "blur(20px) saturate(120%)",
        border: "1px solid rgba(167,139,250,0.18)",
        borderRadius: "28px",
        boxShadow: "0 8px 32px rgba(13,15,26,0.4)"
      }}
    >
      {/* Mobile menu button */}
      <button
        className="flex h-9 w-9 items-center justify-center rounded-xl transition lg:hidden"
        style={{ background: "rgba(167,139,250,0.10)", border: "1px solid rgba(167,139,250,0.20)", color: "#a78bfa" }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="เปิด/ปิดเมนู"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Date/Greeting */}
      <div className="hidden sm:block">
        <p className="text-xs" style={{ color: "#64748b" }}>{getThaiDate(now)}</p>
        <p className="text-sm font-semibold" style={{ color: "#f1f5f9" }}>
          {getGreeting(now.getHours())}{user?.firstName ? `, ${user.firstName}` : ""}
        </p>
      </div>

      {/* Right: status + user + logout */}
      <div className="ml-auto flex items-center gap-3">
        {/* System status pill */}
        <div
          className="hidden items-center gap-2 px-3 py-1.5 md:flex rounded-2xl"
          style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}
        >
          <span className="h-2 w-2 rounded-full bg-nimitt-green animate-pulse-soft" style={{ boxShadow: "0 0 6px rgba(16,185,129,0.7)" }} />
          <span className="text-xs font-medium" style={{ color: "#10b981" }}>ระบบปกติ</span>
        </div>

        {/* User pill */}
        {user && (
          <div
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl"
            style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.20)" }}
          >
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
              style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)", color: "#fff", boxShadow: "0 0 10px rgba(167,139,250,0.4)" }}
            >
              {user.firstName?.charAt(0) ?? "?"}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold leading-none" style={{ color: "#f1f5f9" }}>{user.firstName} {user.lastName}</p>
              <p className="text-[11px] leading-none mt-0.5" style={{ color: "#64748b" }}>{user.email}</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <Button
          variant="secondary"
          onClick={async () => {
            await logout()
            router.replace("/login")
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          ออกจากระบบ
        </Button>
      </div>
    </header>
  )
}
