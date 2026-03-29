"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

import { getPatientById, getPatientStats, getPatientTimeline } from "../api/patients"
import { Badge } from "../components/ui/Badge"
import { Card } from "../components/ui/Card"

interface PatientProfilePageProps {
  patientId: string
}

const RISK_MAP: Record<string, { label: string; tone: "green" | "amber" | "red" }> = {
  LOW: { label: "เสี่ยงต่ำ", tone: "green" },
  MEDIUM: { label: "เสี่ยงปานกลาง", tone: "amber" },
  HIGH: { label: "เสี่ยงสูง", tone: "red" }
}

const TIMELINE_TYPE_MAP: Record<string, { label: string; color: string; icon: string }> = {
  ATTENDED: { label: "มาตามนัด", color: "bg-nimitt-green-bg text-nimitt-green border-nimitt-green/20", icon: "✓" },
  NO_SHOW: { label: "ขาดนัด", color: "bg-nimitt-red-bg text-nimitt-red border-nimitt-red/20", icon: "✕" },
  RESCHEDULED: { label: "เลื่อนนัด", color: "bg-nimitt-amber-bg text-nimitt-amber border-nimitt-amber/20", icon: "↻" },
  PHONE_FOLLOWUP: { label: "โทรติดตาม", color: "bg-nimitt-blue-bg text-nimitt-blue border-nimitt-blue/20", icon: "☎" },
  NOTE: { label: "บันทึก", color: "bg-nimitt-bg text-nimitt-muted border-nimitt-border", icon: "📝" },
  LAB_ORDER: { label: "ส่งตรวจแล็บ", color: "bg-nimitt-purple-bg text-nimitt-purple border-nimitt-purple/20", icon: "🔬" },
  SURGERY: { label: "ผ่าตัด", color: "bg-nimitt-red-bg text-nimitt-red border-nimitt-red/20", icon: "⚕" },
  ALLERGY: { label: "แพ้ยา", color: "bg-nimitt-amber-bg text-nimitt-amber border-nimitt-amber/20", icon: "⚠" },
  MEDICATION: { label: "ยา", color: "bg-nimitt-teal-bg text-nimitt-teal border-nimitt-teal/20", icon: "💊" }
}

function StatBadge({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-nimitt-border bg-nimitt-bg px-4 py-3 text-center">
      <p className="font-mono text-2xl font-semibold text-nimitt-ink">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-nimitt-ink">{label}</p>
      {sub && <p className="text-[11px] text-nimitt-faint">{sub}</p>}
    </div>
  )
}

export function PatientProfilePage({ patientId }: PatientProfilePageProps) {
  const patientQuery = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => getPatientById(patientId),
    enabled: Boolean(patientId)
  })

  const statsQuery = useQuery({
    queryKey: ["patient-stats", patientId],
    queryFn: () => getPatientStats(patientId),
    enabled: Boolean(patientId)
  })

  const timelineQuery = useQuery({
    queryKey: ["patient-timeline", patientId],
    queryFn: () => getPatientTimeline(patientId),
    enabled: Boolean(patientId)
  })

  const patient = patientQuery.data as Record<string, unknown> | null
  const stats = statsQuery.data as Record<string, unknown> | null
  const timeline: Record<string, unknown>[] = (timelineQuery.data as { data?: Record<string, unknown>[] } | undefined)?.data ?? []

  if (patientQuery.isLoading) {
    return (
      <div className="grid gap-5">
        <Card className="flex items-center gap-5 p-6">
          <div className="h-16 w-16 animate-shimmer rounded-2xl" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-48 animate-shimmer rounded-full" />
            <div className="h-3.5 w-32 animate-shimmer rounded-full" />
          </div>
        </Card>
        <div className="grid gap-4 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-20 animate-shimmer rounded-3xl" />)}
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <Card className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-nimitt-bg text-nimitt-faint">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <p className="text-sm text-nimitt-muted">ไม่พบข้อมูลผู้ป่วย</p>
        <Link href="/appointments" className="text-sm font-medium text-nimitt-blue hover:underline">
          ← กลับไปรายการนัดหมาย
        </Link>
      </Card>
    )
  }

  const risk = RISK_MAP[String(patient.riskLevel)] ?? { label: "—", tone: "blue" as const }
  const dob = patient.dateOfBirth
    ? new Date(String(patient.dateOfBirth)).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })
    : "—"

  return (
    <div className="grid gap-5">
      {/* Back link */}
      <div className="animate-fade-in">
        <Link href="/appointments" className="inline-flex items-center gap-1.5 text-sm text-nimitt-muted hover:text-nimitt-ink transition">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          กลับไปรายการนัดหมาย
        </Link>
      </div>

      {/* Patient header */}
      <Card className="animate-slide-up">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-nimitt-blue text-2xl font-bold text-white">
            {String(patient.firstName ?? "?").charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start gap-3">
              <h2 className="text-2xl font-semibold text-nimitt-ink">
                {String(patient.firstName ?? "")} {String(patient.lastName ?? "")}
              </h2>
              <Badge tone={risk.tone}>{risk.label}</Badge>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-nimitt-muted">
              <span>HN: <span className="font-mono font-medium text-nimitt-ink">{String(patient.hn ?? "—")}</span></span>
              <span>วันเกิด: {dob}</span>
              <span>เพศ: {patient.gender === "MALE" ? "ชาย" : patient.gender === "FEMALE" ? "หญิง" : "—"}</span>
              {Boolean(patient.phone) && <span>โทร: {String(patient.phone)}</span>}
              {Boolean(patient.bloodType) && <span>กรุ๊ปเลือด: {String(patient.bloodType)}</span>}
            </div>
            {Array.isArray(patient.allergies) && patient.allergies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {patient.allergies.map((a: unknown) => (
                  <span key={String(a)} className="rounded-full border border-nimitt-red/20 bg-nimitt-red-bg px-2.5 py-0.5 text-xs text-nimitt-red">
                    แพ้: {String(a)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid animate-slide-up gap-3 sm:grid-cols-4" style={{ animationDelay: "75ms" }}>
        <StatBadge label="นัดทั้งหมด" value={String(patient.totalAppointments ?? stats?.total ?? 0)} />
        <StatBadge
          label="มาตามนัด"
          value={String(patient.totalAttended ?? stats?.attended ?? 0)}
          sub={patient.totalAppointments ? `${Math.round(((patient.totalAttended as number ?? 0) / (patient.totalAppointments as number)) * 100)}%` : undefined}
        />
        <StatBadge
          label="ขาดนัด"
          value={String(patient.totalNoShows ?? stats?.noShow ?? 0)}
          sub={patient.totalAppointments ? `${Math.round(((patient.totalNoShows as number ?? 0) / (patient.totalAppointments as number)) * 100)}%` : undefined}
        />
        <StatBadge
          label="No-show Score"
          value={typeof patient.noShowScore === "number" ? patient.noShowScore.toFixed(1) : "—"}
          sub="คะแนนความเสี่ยง"
        />
      </div>

      {/* Timeline */}
      <Card className="animate-slide-up" style={{ animationDelay: "150ms" } as React.CSSProperties}>
        <h3 className="mb-5 text-base font-semibold text-nimitt-ink">ประวัติการติดตาม</h3>

        {timelineQuery.isLoading ? (
          <div className="space-y-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-9 w-9 animate-shimmer rounded-xl" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 w-40 animate-shimmer rounded-full" />
                  <div className="h-2.5 w-64 animate-shimmer rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : timeline.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-nimitt-bg text-nimitt-faint text-xl">📋</div>
            <p className="text-sm text-nimitt-muted">ยังไม่มีประวัติการติดตาม</p>
          </div>
        ) : (
          <ol className="relative border-l-2 border-nimitt-border pl-6 space-y-6">
            {timeline.map((entry, i) => {
              const type = TIMELINE_TYPE_MAP[String(entry.type)] ?? { label: String(entry.type), color: "bg-nimitt-bg text-nimitt-muted border-nimitt-border", icon: "•" }
              const entryDate = entry.entryDate
                ? new Date(String(entry.entryDate)).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })
                : "—"
              return (
                <li
                  key={String(entry.id)}
                  className="animate-slide-up relative"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {/* Timeline dot */}
                  <div className={`absolute -left-9 flex h-7 w-7 items-center justify-center rounded-full border text-xs ${type.color}`}>
                    {type.icon}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-nimitt-ink">{type.label}</span>
                      <span className="text-xs text-nimitt-faint">{entryDate}</span>
                    </div>
                    {Boolean(entry.notes) && (
                      <p className="mt-1 text-sm text-nimitt-muted leading-6">{String(entry.notes)}</p>
                    )}
                    {Boolean(entry.noShowReason) && (
                      <p className="mt-1 text-xs text-nimitt-red">เหตุผล: {String(entry.noShowReason)}</p>
                    )}
                    {Boolean(entry.createdBy) && (
                      <p className="mt-1 text-xs text-nimitt-faint">
                        บันทึกโดย: {String((entry.createdBy as Record<string, unknown>)?.firstName ?? "")} {String((entry.createdBy as Record<string, unknown>)?.lastName ?? "")}
                      </p>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </Card>
    </div>
  )
}
