"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { useAuthStore } from "../../store/authStore"

const ROLE_LABELS: Record<string, string> = {
  NURSE:   "พยาบาล",
  DOCTOR:  "แพทย์",
  MANAGER: "ผู้จัดการ",
  ADMIN:   "ผู้ดูแลระบบ"
}

const menu = [
  {
    to: "/dashboard",
    label: "แดชบอร์ด",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    )
  },
  {
    to: "/appointments",
    label: "นัดหมาย",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
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
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
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
    <aside
      className="flex h-full w-full flex-col p-5 text-white"
      style={{
        background: "rgba(13,15,26,0.85)",
        backdropFilter: "blur(20px) saturate(120%)",
        WebkitBackdropFilter: "blur(20px) saturate(120%)",
        border: "1px solid rgba(167,139,250,0.18)",
        borderRadius: "28px",
        boxShadow: "0 18px 50px rgba(13,15,26,0.6), 0 0 0 0.5px rgba(167,139,250,0.08) inset"
      }}
    >
      {/* Brand */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5">
          {/* Logo icon — lavender gradient */}
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl animate-glow-pulse"
            style={{ background: "linear-gradient(135deg,#a78bfa 0%,#7c3aed 100%)", boxShadow: "0 0 20px rgba(167,139,250,0.4)" }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.28em]" style={{ color: "rgba(167,139,250,0.6)" }}>NimittHIS</p>
        </div>

        {/* Title */}
        <h1
          className="mt-4 text-xl font-bold leading-tight"
          style={{ fontFamily: "'Rajdhani',sans-serif", background: "linear-gradient(135deg,#a78bfa,#f1f5f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
        >
          MindCare
        </h1>
        <p className="mt-1 text-xs leading-5" style={{ color: "rgba(148,163,184,0.7)" }}>
          ระบบติดตามนัดหมาย — จิตเวช
        </p>

        {/* Divider */}
        <div className="mt-4 h-px" style={{ background: "rgba(167,139,250,0.12)" }} />
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1">
        {menu.map((item, i) => {
          const isActive = pathname === item.to
          return (
            <Link
              key={item.to}
              href={item.to}
              className={`group flex animate-slide-in-left items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive ? "" : "hover:text-white"
              }`}
              style={isActive ? {
                background: "linear-gradient(135deg,rgba(167,139,250,0.20) 0%,rgba(124,58,237,0.20) 100%)",
                border: "1px solid rgba(167,139,250,0.35)",
                color: "#a78bfa",
                boxShadow: "0 0 16px rgba(167,139,250,0.15)",
                animationDelay: `${i * 60}ms`
              } : {
                color: "rgba(148,163,184,0.75)",
                animationDelay: `${i * 60}ms`
              }}
              onMouseEnter={isActive ? undefined : (e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"
              }}
              onMouseLeave={isActive ? undefined : (e) => {
                (e.currentTarget as HTMLElement).style.background = ""
              }}
            >
              <span style={{ color: isActive ? "#a78bfa" : "rgba(148,163,184,0.55)" }} className="transition-colors group-hover:opacity-100">
                {item.icon}
              </span>
              {item.label}
              {isActive && (
                <span
                  className="ml-auto h-1.5 w-1.5 rounded-full animate-pulse-soft"
                  style={{ background: "#a78bfa", boxShadow: "0 0 6px rgba(167,139,250,0.8)" }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      {user && (
        <div
          className="mt-4 p-4 rounded-2xl"
          style={{ background: "rgba(167,139,250,0.07)", border: "1px solid rgba(167,139,250,0.15)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold"
              style={{ background: "linear-gradient(135deg,rgba(167,139,250,0.25),rgba(124,58,237,0.25))", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)" }}
            >
              {user.firstName?.charAt(0) ?? "?"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold" style={{ color: "#f1f5f9" }}>
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs" style={{ color: "rgba(167,139,250,0.6)" }}>{ROLE_LABELS[user.role] ?? user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
