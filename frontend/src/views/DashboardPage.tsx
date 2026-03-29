"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

import { getDashboardStats } from "../api/analytics"
import { getTodayAppointments } from "../api/appointments"
import { getPatients } from "../api/patients"
import { Badge } from "../components/ui/Badge"
import { Card } from "../components/ui/Card"

// ─── Skeleton ────────────────────────────────────────────────────────────────

function StatSkeleton() {
  return (
    <div className="rounded-3xl border border-nimitt-border bg-nimitt-surface p-6 shadow-panel">
      <div className="h-3 w-20 animate-shimmer rounded-full" />
      <div className="mt-4 h-10 w-16 animate-shimmer rounded-xl" />
      <div className="mt-3 h-3 w-28 animate-shimmer rounded-full" />
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: number | string
  sub?: string
  tone?: "blue" | "green" | "red" | "amber"
  icon: React.ReactNode
  delay?: number
}

const TONE_BG: Record<string, string> = {
  blue: "bg-nimitt-blue-bg text-nimitt-blue",
  green: "bg-nimitt-green-bg text-nimitt-green",
  red: "bg-nimitt-red-bg text-nimitt-red",
  amber: "bg-nimitt-amber-bg text-nimitt-amber"
}

function StatCard({ label, value, sub, tone = "blue", icon, delay = 0 }: StatCardProps) {
  return (
    <Card
      className="card-lift animate-slide-up"
      style={{ animationDelay: `${delay}ms` } as React.CSSProperties}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-nimitt-muted">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${TONE_BG[tone]}`}>
          {icon}
        </div>
      </div>
      <p className="mt-3 font-mono text-4xl font-semibold text-nimitt-ink">{value}</p>
      {sub && <p className="mt-1.5 text-xs text-nimitt-faint">{sub}</p>}
    </Card>
  )
}

// ─── Appointment Status Badge ─────────────────────────────────────────────────

const STATUS_MAP: Record<string, { label: string; tone: "blue" | "green" | "red" | "amber" | "purple" }> = {
  SCHEDULED: { label: "นัดแล้ว", tone: "blue" },
  CONFIRMED: { label: "ยืนยันแล้ว", tone: "purple" },
  ATTENDED: { label: "มาแล้ว", tone: "green" },
  NO_SHOW: { label: "ขาดนัด", tone: "red" },
  CANCELLED: { label: "ยกเลิก", tone: "amber" },
  RESCHEDULED: { label: "เลื่อนนัด", tone: "amber" }
}

// ─── Risk Level Badge ─────────────────────────────────────────────────────────

const RISK_MAP: Record<string, { label: string; tone: "green" | "amber" | "red" }> = {
  LOW: { label: "ต่ำ", tone: "green" },
  MEDIUM: { label: "ปานกลาง", tone: "amber" },
  HIGH: { label: "สูง", tone: "red" }
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export function DashboardPage() {
  const statsQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStats,
    staleTime: 60_000
  })

  const todayQuery = useQuery({
    queryKey: ["appointments", "today"],
    queryFn: getTodayAppointments,
    staleTime: 60_000
  })

  const highRiskQuery = useQuery({
    queryKey: ["patients", "high-risk"],
    queryFn: () => getPatients({ riskLevel: "HIGH", limit: 5 }),
    staleTime: 120_000
  })

  const stats = statsQuery.data?.todayStats

  return (
    <div className="grid gap-6">
      {/* Stat cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsQuery.isLoading ? (
          [0, 1, 2, 3].map((i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="นัดวันนี้"
              value={stats?.total ?? 0}
              sub="ทั้งหมด"
              tone="blue"
              delay={0}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              }
            />
            <StatCard
              label="มาตามนัด"
              value={stats?.attended ?? 0}
              sub={stats?.total ? `${Math.round(((stats.attended ?? 0) / stats.total) * 100)}% ของทั้งหมด` : undefined}
              tone="green"
              delay={75}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              }
            />
            <StatCard
              label="ขาดนัด"
              value={stats?.noShow ?? 0}
              sub={stats?.total ? `${Math.round(((stats.noShow ?? 0) / stats.total) * 100)}% ของทั้งหมด` : undefined}
              tone="red"
              delay={150}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              }
            />
            <StatCard
              label="รอดำเนินการ"
              value={stats?.pending ?? 0}
              sub="ยังไม่ได้อัปเดต"
              tone="amber"
              delay={225}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
            />
          </>
        )}
      </section>

      {/* Today + High-risk split */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Today's appointments */}
        <Card className="animate-slide-up" style={{ animationDelay: "300ms" } as React.CSSProperties}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-nimitt-ink">นัดหมายวันนี้</h3>
              <p className="text-xs text-nimitt-muted mt-0.5">รายการล่าสุด 10 รายการ</p>
            </div>
            <Link
              href="/appointments"
              className="text-xs font-medium text-nimitt-blue hover:underline"
            >
              ดูทั้งหมด →
            </Link>
          </div>

          {todayQuery.isLoading ? (
            <div className="mt-4 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-9 w-9 animate-shimmer rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-32 animate-shimmer rounded-full" />
                    <div className="h-2.5 w-20 animate-shimmer rounded-full" />
                  </div>
                  <div className="h-6 w-16 animate-shimmer rounded-full" />
                </div>
              ))}
            </div>
          ) : !todayQuery.data?.items?.length ? (
            <div className="mt-8 flex flex-col items-center gap-2 py-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-nimitt-bg text-nimitt-faint">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <p className="text-sm text-nimitt-muted">ไม่มีนัดหมายวันนี้</p>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-nimitt-border">
              {(todayQuery.data?.items ?? []).slice(0, 10).map((appt: Record<string, unknown>, i: number) => {
                const status = STATUS_MAP[String(appt.status)] ?? { label: String(appt.status), tone: "blue" as const }
                return (
                  <li
                    key={String(appt.id)}
                    className="flex items-center gap-3 py-3 animate-slide-up"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-nimitt-blue-bg font-mono text-xs font-semibold text-nimitt-blue">
                      {String(appt.timeFrom ?? "—").slice(0, 5)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-nimitt-ink">
                        {String((appt.patient as Record<string, unknown>)?.firstName ?? "")} {String((appt.patient as Record<string, unknown>)?.lastName ?? "")}
                      </p>
                      <p className="truncate text-xs text-nimitt-muted">
                        {String((appt.doctor as Record<string, unknown>)?.firstName ?? "")} {String((appt.doctor as Record<string, unknown>)?.specialty ?? "")}
                      </p>
                    </div>
                    <Badge tone={status.tone as "blue" | "green" | "red" | "amber" | "purple"}>{status.label}</Badge>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        {/* High-risk patients */}
        <Card className="animate-slide-up" style={{ animationDelay: "375ms" } as React.CSSProperties}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-nimitt-ink">ผู้ป่วยเสี่ยงสูง</h3>
              <p className="text-xs text-nimitt-muted mt-0.5">no-show score สูงสุด</p>
            </div>
            <Link
              href="/noshow"
              className="text-xs font-medium text-nimitt-red hover:underline"
            >
              ดูทั้งหมด →
            </Link>
          </div>

          {highRiskQuery.isLoading ? (
            <div className="mt-4 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-9 w-9 animate-shimmer rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-28 animate-shimmer rounded-full" />
                    <div className="h-2.5 w-16 animate-shimmer rounded-full" />
                  </div>
                  <div className="h-6 w-12 animate-shimmer rounded-full" />
                </div>
              ))}
            </div>
          ) : !highRiskQuery.data?.items?.length ? (
            <div className="mt-8 flex flex-col items-center gap-2 py-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-nimitt-green-bg text-nimitt-green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-sm text-nimitt-muted">ไม่มีผู้ป่วยเสี่ยงสูงในขณะนี้</p>
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {(highRiskQuery.data?.items ?? []).slice(0, 5).map((patient: Record<string, unknown>, i: number) => {
                const risk = RISK_MAP[String(patient.riskLevel)] ?? { label: "—", tone: "amber" as const }
                return (
                  <li
                    key={String(patient.id)}
                    className="flex animate-slide-up items-center gap-3 rounded-2xl border border-nimitt-border p-3 transition hover:bg-nimitt-bg"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-nimitt-red-bg font-semibold text-sm text-nimitt-red">
                      {String(patient.firstName ?? "?").charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-nimitt-ink">
                        {String(patient.firstName ?? "")} {String(patient.lastName ?? "")}
                      </p>
                      <p className="text-xs text-nimitt-muted">
                        HN {String(patient.hn ?? "—")} · ขาดนัด {String(patient.totalNoShows ?? 0)} ครั้ง
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge tone={risk.tone}>{risk.label}</Badge>
                      <p className="font-mono text-xs text-nimitt-faint">
                        {typeof patient.noShowScore === "number" ? patient.noShowScore.toFixed(0) : "—"}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
