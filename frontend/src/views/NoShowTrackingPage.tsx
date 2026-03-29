"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { getPatients } from "../api/patients"
import { getOverdueAppointments } from "../api/appointments"
import { Badge } from "../components/ui/Badge"
import { Card } from "../components/ui/Card"

type Tab = "high-risk" | "overdue"

const RISK_MAP: Record<string, { label: string; tone: "green" | "amber" | "red"; bar: string }> = {
  LOW: { label: "ต่ำ", tone: "green", bar: "bg-nimitt-green" },
  MEDIUM: { label: "ปานกลาง", tone: "amber", bar: "bg-nimitt-amber" },
  HIGH: { label: "สูง", tone: "red", bar: "bg-nimitt-red" }
}

function RiskScoreBar({ score }: { score: number }) {
  const capped = Math.min(100, Math.max(0, score))
  const color = capped >= 70 ? "bg-nimitt-red" : capped >= 40 ? "bg-nimitt-amber" : "bg-nimitt-green"
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-nimitt-border">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${capped}%` }}
        />
      </div>
      <span className="font-mono text-xs text-nimitt-muted">{capped.toFixed(0)}</span>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 border-b border-nimitt-border py-4">
      <div className="h-10 w-10 animate-shimmer rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-36 animate-shimmer rounded-full" />
        <div className="h-2.5 w-24 animate-shimmer rounded-full" />
      </div>
      <div className="h-3 w-16 animate-shimmer rounded-full" />
      <div className="h-6 w-14 animate-shimmer rounded-full" />
    </div>
  )
}

export function NoShowTrackingPage() {
  const [tab, setTab] = useState<Tab>("high-risk")

  const riskQuery = useQuery({
    queryKey: ["patients", "high-risk-all"],
    queryFn: () => getPatients({ riskLevel: "HIGH", limit: 20 }),
    staleTime: 60_000
  })

  const overdueQuery = useQuery({
    queryKey: ["appointments", "overdue"],
    queryFn: getOverdueAppointments,
    staleTime: 60_000
  })

  const riskItems: Record<string, unknown>[] = riskQuery.data?.items ?? []
  const overdueItems: Record<string, unknown>[] = overdueQuery.data?.items ?? []

  return (
    <div className="grid gap-5">
      {/* Header */}
      <div className="animate-slide-up">
        <h2 className="text-2xl font-semibold text-nimitt-ink">ติดตามขาดนัด</h2>
        <p className="mt-0.5 text-sm text-nimitt-muted">ผู้ป่วยกลุ่มเสี่ยงและนัดที่เกินกำหนด</p>
      </div>

      {/* Summary badges */}
      <div className="grid animate-slide-up gap-4 sm:grid-cols-3" style={{ animationDelay: "75ms" }}>
        <Card className="flex items-center gap-4 p-4">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-nimitt-red-bg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-nimitt-muted">ความเสี่ยงสูง</p>
            <p className="font-mono text-2xl font-semibold text-nimitt-ink">{riskQuery.isLoading ? "—" : riskItems.length}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-4">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-nimitt-amber-bg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-nimitt-muted">เกินกำหนด</p>
            <p className="font-mono text-2xl font-semibold text-nimitt-ink">{overdueQuery.isLoading ? "—" : overdueItems.length}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-4">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-nimitt-blue-bg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-nimitt-muted">ต้องติดตาม</p>
            <p className="font-mono text-2xl font-semibold text-nimitt-ink">
              {riskQuery.isLoading ? "—" : riskItems.length + overdueItems.length}
            </p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="animate-slide-up overflow-hidden p-0" style={{ animationDelay: "150ms" }}>
        {/* Tab bar */}
        <div className="flex border-b border-nimitt-border px-4 pt-4">
          {(["high-risk", "overdue"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative mr-6 pb-3 text-sm font-medium transition-colors ${
                tab === t ? "text-nimitt-ink" : "text-nimitt-muted hover:text-nimitt-ink"
              }`}
            >
              {t === "high-risk" ? "ผู้ป่วยเสี่ยงสูง" : "นัดเกินกำหนด"}
              {tab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-nimitt-blue" />
              )}
            </button>
          ))}
        </div>

        <div className="p-4">
          {/* High-risk tab */}
          {tab === "high-risk" && (
            <div>
              {riskQuery.isLoading ? (
                <div>{[0, 1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)}</div>
              ) : riskItems.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-nimitt-green-bg text-nimitt-green">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-sm text-nimitt-muted">ไม่มีผู้ป่วยเสี่ยงสูง</p>
                </div>
              ) : (
                <ul className="divide-y divide-nimitt-border">
                  {riskItems.map((p, i) => {
                    const risk = RISK_MAP[String(p.riskLevel)] ?? RISK_MAP.MEDIUM
                    const score = typeof p.noShowScore === "number" ? p.noShowScore : 0
                    return (
                      <li
                        key={String(p.id)}
                        className="flex animate-slide-up items-center gap-4 py-4"
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-nimitt-red-bg font-semibold text-nimitt-red">
                          {String(p.firstName ?? "?").charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-nimitt-ink">
                            {String(p.firstName ?? "")} {String(p.lastName ?? "")}
                          </p>
                          <p className="text-xs text-nimitt-muted">
                            HN {String(p.hn ?? "—")} · โทร {String(p.phone ?? "—")}
                          </p>
                        </div>
                        <div className="hidden sm:block">
                          <RiskScoreBar score={score} />
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-nimitt-muted">ขาดนัด</p>
                          <p className="font-mono text-base font-semibold text-nimitt-red">{String(p.totalNoShows ?? 0)}</p>
                        </div>
                        <Badge tone={risk.tone}>{risk.label}</Badge>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )}

          {/* Overdue tab */}
          {tab === "overdue" && (
            <div>
              {overdueQuery.isLoading ? (
                <div>{[0, 1, 2, 3].map((i) => <SkeletonRow key={i} />)}</div>
              ) : overdueItems.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-nimitt-green-bg text-nimitt-green">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-sm text-nimitt-muted">ไม่มีนัดที่เกินกำหนด</p>
                </div>
              ) : (
                <ul className="divide-y divide-nimitt-border">
                  {overdueItems.map((appt, i) => {
                    const apptDate = appt.appointmentDate
                      ? new Date(String(appt.appointmentDate)).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })
                      : "—"
                    return (
                      <li
                        key={String(appt.id)}
                        className="flex animate-slide-up items-center gap-4 py-4"
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-nimitt-amber-bg">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-nimitt-ink">
                            {String((appt.patient as Record<string, unknown>)?.firstName ?? "")} {String((appt.patient as Record<string, unknown>)?.lastName ?? "")}
                          </p>
                          <p className="text-xs text-nimitt-muted">
                            นัด {apptDate} · {String(appt.timeFrom ?? "").slice(0, 5)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-nimitt-muted">{String((appt.clinic as Record<string, unknown>)?.name ?? "—")}</p>
                        </div>
                        <Badge tone="amber">เกินกำหนด</Badge>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
