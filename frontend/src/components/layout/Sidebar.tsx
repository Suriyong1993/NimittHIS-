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
  { to: "/dashboard", label: "แดชบอร์ด", hint: "ภาพรวมเวรและงานสำคัญ" },
  { to: "/appointments", label: "นัดหมาย", hint: "คิวตรวจ ห้องตรวจ และแพทย์" },
  { to: "/noshow", label: "ติดตามขาดนัด", hint: "งาน outreach และผู้ป่วยเสี่ยง" },
  { to: "/analytics", label: "วิเคราะห์", hint: "ผลลัพธ์การดูแลและภาระงาน" }
]

export function Sidebar() {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)

  return (
    <aside
      className="flex h-full w-full flex-col rounded-[32px] p-5 text-white xl:p-6"
      style={{ background: "var(--nav-bg)", boxShadow: "0 28px 54px rgba(15,39,56,0.26)" }}
    >
      <div className="mb-7">
        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-3 py-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">NH</span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">NimittHIS</p>
            <p className="text-sm font-medium text-white/95">ระบบติดตามนัดหมายจิตเวช</p>
          </div>
        </div>

        <div className="mt-5 rounded-[28px] border border-white/10 bg-white/10 p-4 xl:p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-white/60">Clinical Workspace</p>
          <h2 className="mt-2 text-[26px] font-semibold leading-tight text-white">
            ออกแบบให้ทีมรักษาเห็นงานสำคัญก่อนเสมอ
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/72">
            เห็นภาพรวมผู้ป่วย คิวตรวจ งานติดตาม และผลลัพธ์เชิงคลินิกจากชุดหน้าจอเดียว
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-[20px] bg-white/8 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Realtime</p>
              <p className="mt-2 text-sm font-semibold text-white">ข้อมูลอัปเดตทันที</p>
            </div>
            <div className="rounded-[20px] bg-white/8 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">AI Assist</p>
              <p className="mt-2 text-sm font-semibold text-white">สรุป ช่วยคิด ช่วยติดตาม</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2.5">
        {menu.map((item) => {
          const active = pathname === item.to
          return (
            <Link
              key={item.to}
              href={item.to}
              className="rounded-[24px] px-4 py-4 transition-all duration-150"
              style={
                active
                  ? {
                      background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.12) 100%)",
                      border: "1px solid rgba(255,255,255,0.2)"
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)"
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
                  style={{ background: active ? "#9ad0ef" : "rgba(255,255,255,0.25)" }}
                />
              </div>
            </Link>
          )
        })}
      </nav>

      {user ? (
        <div className="mt-5 rounded-[26px] border border-white/10 bg-white/8 p-4">
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
