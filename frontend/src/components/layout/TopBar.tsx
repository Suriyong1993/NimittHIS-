"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "../../store/authStore"
import { useUiStore } from "../../store/uiStore"

const THAI_DAYS = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"]
const THAI_MONTHS = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"]

function getThaiDate(d: Date) {
  return `วัน${THAI_DAYS[d.getDay()]}ที่ ${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`
}
function getGreeting(hour: number) {
  if (hour < 12) return "อรุณสวัสดิ์"
  if (hour < 17) return "สวัสดีตอนบ่าย"
  return "สวัสดีตอนเย็น"
}

export function TopBar() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen)
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <header
      className="flex items-center justify-between gap-4 px-6 h-full border-b"
      style={{
        background: "rgba(6,13,31,0.85)",
        borderColor: "rgba(99,179,237,0.13)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Mobile hamburger */}
      <button
        className="flex h-9 w-9 items-center justify-center rounded-xl border text-slate-400 transition hover:text-slate-200 lg:hidden"
        style={{ borderColor: "rgba(99,179,237,0.18)", background: "rgba(12,26,60,0.5)" }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="เปิด/ปิดเมนู"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Date + greeting */}
      <div className="hidden sm:block">
        <p className="font-mono text-[11px] text-slate-500 tracking-widest">{getThaiDate(now)}</p>
        <p className="text-sm font-semibold text-slate-100">
          {getGreeting(now.getHours())}{user?.firstName ? `, ${user.firstName}` : ""} 👋
        </p>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        {/* System status */}
        <div
          className="hidden items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs text-emerald-400 md:flex"
          style={{ borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.08)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px #10b981" }} />
          ระบบปกติ
        </div>

        {/* User pill */}
        {user && (
          <div
            className="flex items-center gap-2.5 rounded-xl border px-3 py-1.5"
            style={{ borderColor: "rgba(99,179,237,0.18)", background: "rgba(12,26,60,0.6)" }}
          >
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg font-bold text-xs text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #7c3aed, #22d3ee)" }}
            >
              {user.firstName?.charAt(0) ?? "?"}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-100 leading-none">{user.firstName} {user.lastName}</p>
              <p className="font-mono text-[11px] text-violet-400 leading-none mt-0.5">{user.email}</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={async () => { await logout(); router.replace("/login") }}
          className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm text-rose-400 transition-all hover:bg-rose-500/10"
          style={{ borderColor: "rgba(244,63,94,0.25)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span className="hidden sm:inline">ออกจากระบบ</span>
        </button>
      </div>
    </header>
  )
}
