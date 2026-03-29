"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { useAuthStore } from "../../store/authStore"

const ROLE_LABELS: Record<string, string> = {
  NURSE: "พยาบาล",
  DOCTOR: "แพทย์",
  MANAGER: "ผู้จัดการ",
  ADMIN: "ผู้ดูแลระบบ"
}

const menu = [
  {
    to: "/dashboard",
    label: "แดชบอร์ด",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    )
  },
  {
    to: "/appointments",
    label: "นัดหมาย",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    )
  },
  {
    to: "/noshow",
    label: "ติดตามขาดนัด",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    )
  },
  {
    to: "/analytics",
    label: "วิเคราะห์",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    )
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)

  return (
    <aside className="flex h-full w-full flex-col rounded-[28px] border border-white/20 bg-[#111110] p-5 text-white shadow-panel">
      {/* Brand */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-nimitt-blue">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-white/60">NimittHIS</p>
        </div>
        <h1 className="mt-4 text-xl font-semibold leading-tight">ระบบติดตามนัดหมาย</h1>
        <p className="mt-1.5 text-xs leading-5 text-white/50">Hospital Operations Dashboard</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1">
        {menu.map((item, i) => {
          const isActive = pathname === item.to
          return (
            <Link
              key={item.to}
              href={item.to}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`group flex animate-slide-in-left items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white text-nimitt-ink shadow-sm"
                  : "text-white/65 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className={`transition-colors ${isActive ? "text-nimitt-blue" : "text-white/50 group-hover:text-white/80"}`}>
                {item.icon}
              </span>
              {item.label}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-nimitt-blue" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      {user && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-nimitt-blue/20 text-sm font-semibold text-nimitt-blue">
              {user.firstName?.charAt(0) ?? "?"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-white/50">{ROLE_LABELS[user.role] ?? user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
