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
    <header className="glass px-6 py-4 rounded-[32px] flex items-center justify-between gap-6 animate-entrance">
      {/* Mobile menu button */}
      <button
        className="lg:hidden flex h-10 w-10 items-center justify-center rounded-2xl glass-light text-primary active:scale-95 transition-transform"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="เปิด/ปิดเมนู"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Date/Greeting */}
      <div className="hidden sm:block">
        <p className="text-[10px] uppercase tracking-widest text-muted font-bold">{getThaiDate(now)}</p>
        <h1 className="text-lg font-bold tracking-tight mt-0.5">
          {getGreeting(now.getHours())}{user?.firstName ? `, คุณ${user.firstName}` : ""}
        </h1>
      </div>

      {/* Right: status + user + logout */}
      <div className="ml-auto flex items-center gap-4">
        {/* System status pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">System Online</span>
        </div>

        {/* User profile */}
        {user && (
          <div className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl glass-light border-white/5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
              {user.firstName?.charAt(0) ?? "?"}
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-bold leading-none">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-muted mt-1">{user.email}</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <Button
          variant="secondary"
          className="rounded-2xl h-12 px-6 font-bold text-xs tap-active bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-none"
          onClick={async () => {
            await logout()
            router.replace("/login")
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          ออกระบบ
        </Button>
      </div>
    </header>
  )
}

