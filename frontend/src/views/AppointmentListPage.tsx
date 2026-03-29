"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { getAppointments } from "../api/appointments"
import { Badge } from "../components/ui/Badge"
import { Card } from "../components/ui/Card"

const STATUS_OPTIONS = [
  { value: "", label: "ทุกสถานะ" },
  { value: "SCHEDULED", label: "นัดแล้ว" },
  { value: "CONFIRMED", label: "ยืนยันแล้ว" },
  { value: "ATTENDED", label: "มาแล้ว" },
  { value: "NO_SHOW", label: "ขาดนัด" },
  { value: "CANCELLED", label: "ยกเลิก" }
]

const STATUS_MAP: Record<string, { label: string; tone: "blue" | "green" | "red" | "amber" | "purple" }> = {
  SCHEDULED: { label: "นัดแล้ว", tone: "blue" },
  CONFIRMED: { label: "ยืนยันแล้ว", tone: "purple" },
  ATTENDED: { label: "มาแล้ว", tone: "green" },
  NO_SHOW: { label: "ขาดนัด", tone: "red" },
  CANCELLED: { label: "ยกเลิก", tone: "amber" },
  RESCHEDULED: { label: "เลื่อนนัด", tone: "amber" }
}

function RowSkeleton() {
  return (
    <tr className="border-b border-nimitt-border">
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 animate-shimmer rounded-full" style={{ width: `${40 + i * 12}%` }} />
        </td>
      ))}
    </tr>
  )
}

export function AppointmentListPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ["appointments", { search, status, page }],
    queryFn: () => getAppointments({ search: search || undefined, status: status || undefined, page, limit: 15 }),
    staleTime: 30_000
  })

  const items: Record<string, unknown>[] = (data as { data?: Record<string, unknown>[] } | undefined)?.data ?? []
  const total: number = (data as { total?: number } | undefined)?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / 15))

  return (
    <div className="grid gap-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-slide-up">
          <h2 className="text-2xl font-semibold text-nimitt-ink">รายการนัดหมาย</h2>
          <p className="mt-0.5 text-sm text-nimitt-muted">
            {isLoading ? "กำลังโหลด..." : `${total.toLocaleString()} รายการทั้งหมด`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="animate-slide-up p-4" style={{ animationDelay: "75ms" } as React.CSSProperties}>
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-nimitt-faint">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="ค้นหาชื่อผู้ป่วย, HN..."
              className="w-full rounded-2xl border border-nimitt-border bg-nimitt-bg py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-nimitt-blue focus:bg-white focus:ring-2 focus:ring-nimitt-blue/20"
            />
          </div>

          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            className="rounded-2xl border border-nimitt-border bg-nimitt-bg px-4 py-2.5 text-sm outline-none transition focus:border-nimitt-blue focus:ring-2 focus:ring-nimitt-blue/20"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card className="animate-slide-up overflow-hidden p-0" style={{ animationDelay: "150ms" } as React.CSSProperties}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-nimitt-border bg-nimitt-bg">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-nimitt-muted">ผู้ป่วย</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-nimitt-muted">วัน/เวลา</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-nimitt-muted">แพทย์</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-nimitt-muted">คลินิก</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-nimitt-muted">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nimitt-border">
              {isLoading ? (
                [0, 1, 2, 3, 4, 5].map((i) => <RowSkeleton key={i} />)
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-sm text-nimitt-muted">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-nimitt-bg text-nimitt-faint">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                      </div>
                      ไม่พบข้อมูล
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((appt, i) => {
                  const s = STATUS_MAP[String(appt.status)] ?? { label: String(appt.status), tone: "blue" as const }
                  const apptDate = appt.appointmentDate ? new Date(String(appt.appointmentDate)).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" }) : "—"
                  return (
                    <tr
                      key={String(appt.id)}
                      className="animate-fade-in transition hover:bg-nimitt-bg/50"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-nimitt-ink">
                          {String((appt.patient as Record<string, unknown>)?.firstName ?? "")} {String((appt.patient as Record<string, unknown>)?.lastName ?? "")}
                        </p>
                        <p className="text-xs text-nimitt-muted">HN {String((appt.patient as Record<string, unknown>)?.hn ?? "—")}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-nimitt-ink">{apptDate}</p>
                        <p className="text-xs text-nimitt-muted font-mono">
                          {String(appt.timeFrom ?? "").slice(0, 5)} – {String(appt.timeTo ?? "").slice(0, 5)}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-nimitt-ink">
                        {String((appt.doctor as Record<string, unknown>)?.firstName ?? "—")} {String((appt.doctor as Record<string, unknown>)?.lastName ?? "")}
                      </td>
                      <td className="px-4 py-3 text-nimitt-muted">
                        {String((appt.clinic as Record<string, unknown>)?.name ?? "—")}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={s.tone}>{s.label}</Badge>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-nimitt-border px-4 py-3">
            <p className="text-xs text-nimitt-muted">
              หน้า {page} จาก {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-xl border border-nimitt-border bg-nimitt-bg px-3 py-1.5 text-xs font-medium transition hover:bg-white disabled:opacity-40"
              >
                ← ก่อนหน้า
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border border-nimitt-border bg-nimitt-bg px-3 py-1.5 text-xs font-medium transition hover:bg-white disabled:opacity-40"
              >
                ถัดไป →
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
