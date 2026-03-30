"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    )
  },
  {
    to: "/appointments",
    label: "นัดหมาย",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    to: "/noshow",
    label: "ติดตามขาดนัด",
    badge: true,
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    )
  },
  {
    to: "/analytics",
    label: "วิเคราะห์ข้อมูล",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    )
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  return (
    <aside
      className="flex h-full w-full flex-col px-4 py-5"
      style={{
        background: "rgba(6,13,31,0.97)",
        borderRight: "1px solid rgba(99,179,237,0.13)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #22d3ee)",
            boxShadow: "0 0 24px rgba(124,58,237,0.4)",
          }}
        >
          ⚕️
        </div>
        <div>
          <div
            className="font-mono text-sm font-bold tracking-[0.18em]"
            style={{
              background: "linear-gradient(90deg, #a78bfa, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            NIMITTHIS
          </div>
          <div className="font-mono text-[10px] text-slate-500">v2.0 · Hospital Ops</div>
        </div>
      </div>

      {/* Section label */}
      <div className="mt-6 mb-1">
        <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest px-2 mb-1">
          ภาพรวม
        </p>
        <NavLink item={menu[0]} active={pathname === menu[0].to} />
      </div>

      <div className="mt-4">
        <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest px-2 mb-1">
          การจัดการ
        </p>
        {menu.slice(1).map((item) => (
          <NavLink key={item.to} item={item} active={pathname === item.to} />
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User card + logout */}
      <div className="border-t pt-4" style={{ borderColor: "rgba(99,179,237,0.12)" }}>
        {user && (
          <div
            className="flex items-center gap-3 p-3 rounded-xl border mb-2"
            style={{
              background: "rgba(12,26,60,0.6)",
              borderColor: "rgba(99,179,237,0.15)",
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #22d3ee)" }}
            >
              {user.firstName?.charAt(0) ?? "?"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-100 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="font-mono text-[11px] text-violet-400">
                {ROLE_LABELS[user.role] ?? user.role}
              </p>
            </div>
            {/* Online dot */}
            <span
              className="w-2 h-2 rounded-full shrink-0 ml-auto"
              style={{
                background: "#10b981",
                boxShadow: "0 0 8px #10b981",
                animation: "statusBlink 2s ease-in-out infinite",
              }}
            />
          </div>
        )}

        <button
          onClick={async () => { await logout(); router.replace("/login") }}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-rose-400 text-sm transition-colors hover:bg-rose-500/10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          ออกจากระบบ
        </button>
      </div>

      <style jsx>{`
        @keyframes statusBlink { 0%,100%{opacity:1} 50%{opacity:0.35} }
      `}</style>
    </aside>
  )
}

function NavLink({ item, active }: { item: typeof menu[number]; active: boolean }) {
  return (
    <Link
      href={item.to}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-0.5 border relative"
      style={active ? {
        background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(34,211,238,0.06))",
        borderColor: "rgba(139,92,246,0.4)",
        color: "#a78bfa",
        paddingLeft: "16px",
      } : {
        borderColor: "transparent",
        color: "#64748b",
      }}
    >
      {active && (
        <span
          className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-full"
          style={{ background: "linear-gradient(to bottom, #a78bfa, #22d3ee)" }}
        />
      )}
      <span className="w-5 flex items-center justify-center shrink-0">{item.icon}</span>
      <span className="flex-1">{item.label}</span>
      {(item as any).badge && (
        <span
          className="font-mono text-[11px] px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(244,63,94,0.12)",
            border: "1px solid rgba(244,63,94,0.3)",
            color: "#f43f5e",
          }}
        >
          3
        </span>
      )}
    </Link>
  )
}
