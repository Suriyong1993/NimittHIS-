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
  { to: "/dashboard", label: "แดชบอร์ด", hint: "ภาพรวมผู้ป่วยวันนี้" },
  { to: "/appointments", label: "นัดหมาย", hint: "ตารางนัดและการยืนยัน" },
  { to: "/noshow", label: "ติดตามขาดนัด", hint: "กลุ่มเสี่ยงและคิวตกหล่น" },
  { to: "/analytics", label: "วิเคราะห์", hint: "ภาพรวมเชิงบริหาร" }
]

export function Sidebar() {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)

  return (
    <aside
      className="flex h-full w-full flex-col rounded-[32px] p-6 text-white"
      style={{ background: "var(--nav-bg)", boxShadow: "0 28px 54px rgba(24,58,54,0.24)" }}
    >
      <div className="mb-8">
        <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-3 py-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">MH</span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">NimittHIS</p>
            <p className="text-sm font-medium text-white/95">ระบบติดตามนัดหมาย — จิตเวช</p>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] bg-white/10 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-white/60">Care Focus</p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-white">
            ออกแบบเพื่อแพทย์และพยาบาล
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/72">
            เห็นภาพรวมผู้ป่วย นัดหมาย การติดตามขาดนัด และผลลัพธ์เชิงคลินิกจากหน้าจอเดียว
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {menu.map((item) => {
          const active = pathname === item.to
          return (
            <Link
              key={item.to}
              href={item.to}
              className="rounded-[22px] px-4 py-4 transition-all"
              style={
                active
                  ? {
                      background: "rgba(255,255,255,0.16)",
                      border: "1px solid rgba(255,255,255,0.18)"
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.05)"
                    }
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-white">{item.label}</p>
                  <p className="mt-1 text-xs leading-6 text-white/65">{item.hint}</p>
                </div>
                <span
                  className="mt-1 inline-flex h-2.5 w-2.5 rounded-full"
                  style={{ background: active ? "#f4d3a0" : "rgba(255,255,255,0.25)" }}
                />
              </div>
            </Link>
          )
        })}
      </nav>

      {user ? (
        <div className="mt-6 rounded-[24px] border border-white/10 bg-white/8 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-white/58">กำลังใช้งาน</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/14 text-base font-semibold">
              {user.firstName?.charAt(0) ?? "?"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-white/65">{ROLE_LABELS[user.role] ?? user.role}</p>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  )
}
