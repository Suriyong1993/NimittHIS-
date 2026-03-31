"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { getDashboardStats } from "../api/analytics"
import { getTodayAppointments } from "../api/appointments"
import { getPatients } from "../api/patients"
import { useAuthStore } from "../store/authStore"

type RiskPatient = {
  id: string
  firstName: string
  lastName: string
  hn: string
  riskLevel: string
  totalNoShows: number
  noShowScore: number
}

type TodayAppointment = {
  id: string
  patient?: { firstName?: string; lastName?: string }
  timeFrom: string
  clinic?: { name?: string }
  status: string
}

const fallbackRiskPatients: RiskPatient[] = [
  { id: "1", firstName: "สมชาย", lastName: "พูนสุข", hn: "0001234", riskLevel: "HIGH", totalNoShows: 4, noShowScore: 0.81 },
  { id: "2", firstName: "รัตนา", lastName: "ใจดี", hn: "0001934", riskLevel: "HIGH", totalNoShows: 5, noShowScore: 0.76 },
  { id: "3", firstName: "อารยา", lastName: "มั่นคง", hn: "0002128", riskLevel: "MEDIUM", totalNoShows: 2, noShowScore: 0.46 }
]

const fallbackTodayAppointments: TodayAppointment[] = [
  { id: "a1", patient: { firstName: "วิไล", lastName: "ศรีสุข" }, timeFrom: "09:00", clinic: { name: "คลินิกจิตเวชผู้ใหญ่" }, status: "CONFIRMED" },
  { id: "a2", patient: { firstName: "ประเสริฐ", lastName: "ทองมา" }, timeFrom: "10:30", clinic: { name: "คลินิกติดตามยา" }, status: "SCHEDULED" },
  { id: "a3", patient: { firstName: "สุดา", lastName: "คำดี" }, timeFrom: "13:00", clinic: { name: "คลินิกให้คำปรึกษา" }, status: "ATTENDED" }
]

const nurseTasks = [
  "โทรยืนยันผู้ป่วยเสี่ยงสูงก่อน 09:30 น.",
  "ตรวจสอบคิวที่ยังไม่มาถึงและอัปเดตหน้า room status",
  "เตรียมแบบคัดกรองสั้นสำหรับเคสที่มีประวัติขาดนัดซ้ำ"
]

const doctorTasks = [
  "ทบทวน continuity summary ของเคสเสี่ยงก่อนเริ่ม session แรก",
  "ดู medication continuity ในผู้ป่วยที่มีแนวโน้มยาหมดก่อนนัดถัดไป",
  "วางแผน follow-up mode สำหรับเคสที่ adherence ต่ำ"
]

const managerTasks = [
  "ตรวจ backlog ทีมติดตามที่ยังไม่ปิดภายใน 3 วัน",
  "ดูจำนวน no-show ราย session เพื่อปรับกำลังคนสัปดาห์หน้า",
  "เฝ้าระวังคลินิกที่มีอัตราค้างอัปเดตสถานะสูง"
]

function statusLabel(status: string) {
  if (status === "ATTENDED") return { label: "มาแล้ว", className: "status-success" }
  if (status === "CONFIRMED") return { label: "ยืนยันแล้ว", className: "status-brand" }
  if (status === "NO_SHOW") return { label: "ขาดนัด", className: "status-danger" }
  return { label: "รอดำเนินการ", className: "status-warning" }
}

function roleLabel(role?: string) {
  if (role === "DOCTOR") return "แพทย์"
  if (role === "MANAGER") return "ผู้จัดการคลินิก"
  if (role === "ADMIN") return "ผู้ดูแลระบบ"
  return "พยาบาล"
}

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  const { data: dashboardData } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStats,
    retry: false
  })

  const { data: riskData } = useQuery({
    queryKey: ["dashboard", "high-risk-preview"],
    queryFn: () => getPatients({ riskLevel: "HIGH", limit: 3 }),
    retry: false
  })

  const { data: todayData } = useQuery({
    queryKey: ["dashboard", "today-appointments"],
    queryFn: getTodayAppointments,
    retry: false
  })

  const todayStats = dashboardData?.todayStats ?? {
    total: 24,
    attended: 14,
    noShow: 3,
    pending: 7,
    cancelled: 1
  }

  const riskPatients = useMemo<RiskPatient[]>(
    () => (Array.isArray(riskData) ? (riskData as RiskPatient[]) : fallbackRiskPatients),
    [riskData]
  )

  const todayAppointments = useMemo<TodayAppointment[]>(
    () => (Array.isArray(todayData) ? (todayData as TodayAppointment[]) : fallbackTodayAppointments),
    [todayData]
  )

  const roleTasks = useMemo(() => {
    if (user?.role === "DOCTOR") return doctorTasks
    if (user?.role === "MANAGER" || user?.role === "ADMIN") return managerTasks
    return nurseTasks
  }, [user?.role])

  const clinicReadiness = [
    { name: "คลินิกจิตเวชผู้ใหญ่", ready: 9, total: 12, note: "มีเคสเสี่ยงสูง 2 ราย" },
    { name: "คลินิกติดตามยา", ready: 6, total: 8, note: "ค้างยืนยัน 1 ราย" },
    { name: "คลินิกให้คำปรึกษา", ready: 3, total: 4, note: "session บ่ายเริ่ม 13:00 น." }
  ]

  return (
    <div className="space-y-6">
      <section className="section-card soft-grid overflow-hidden px-6 py-7 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="status-badge status-brand">Morning Command Center</span>
            <h2 className="mt-4 text-[34px] font-semibold leading-tight tracking-[-0.03em]">
              หน้าหลักสำหรับจัดการเวรจิตเวชให้แพทย์และพยาบาลเห็นสิ่งที่ต้องทำก่อนเสมอ
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-8" style={{ color: "var(--ink-muted)" }}>
              มุมมองนี้แยกงานที่ต้องตัดสินใจทันที งานติดตามที่ค้างอยู่ และความพร้อมของแต่ละ session เพื่อช่วยลดภาระการคุยข้ามทีมระหว่างวัน
            </p>
          </div>

          <div className="surface-strong rounded-[28px] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--brand)" }}>
              Focus For {roleLabel(user?.role)}
            </p>
            <div className="mt-4 space-y-3">
              {roleTasks.map((item) => (
                <div key={item} className="flex gap-3 rounded-[20px] bg-[var(--page-bg-soft)] px-4 py-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full" style={{ background: "var(--accent)" }} />
                  <p className="text-sm leading-7">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "นัดหมายวันนี้", value: todayStats.total, tone: "status-brand" },
          { label: "มาตามนัดแล้ว", value: todayStats.attended, tone: "status-success" },
          { label: "ขาดนัด", value: todayStats.noShow, tone: "status-danger" },
          { label: "ค้างอัปเดต", value: todayStats.pending, tone: "status-warning" }
        ].map((item) => (
          <div key={item.label} className="section-card px-5 py-5">
            <span className={`status-badge ${item.tone}`}>{item.label}</span>
            <p className="mt-4 text-[40px] font-semibold tracking-[-0.04em]">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="section-card px-6 py-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-2xl font-semibold tracking-[-0.03em]">Outreach priority วันนี้</h3>
              <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
                รายชื่อที่ควรโทรหรือจัด follow-up ก่อนหลุดจากแผนการรักษา
              </p>
            </div>
            <span className="status-badge status-warning">{riskPatients.length} ราย</span>
          </div>

          <div className="mt-5 space-y-3">
            {riskPatients.map((patient) => (
              <div
                key={patient.id}
                className="surface-strong flex flex-wrap items-center gap-4 rounded-[24px] px-4 py-4"
              >
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, var(--danger) 0%, #d4877e 100%)" }}
                >
                  {patient.firstName.charAt(0)}
                </div>
                <div className="min-w-[180px] flex-1">
                  <p className="text-base font-semibold">
                    {patient.firstName} {patient.lastName}
                  </p>
                  <p className="mt-1 text-xs font-medium" style={{ color: "var(--ink-muted)" }}>
                    HN {patient.hn} • ขาดนัดสะสม {patient.totalNoShows} ครั้ง
                  </p>
                </div>
                <div className="min-w-[170px]">
                  <p className="text-xs font-semibold" style={{ color: "var(--ink-muted)" }}>
                    No-show score
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--page-bg-soft)]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round(patient.noShowScore * 100)}%`,
                        background: "linear-gradient(90deg, var(--accent) 0%, var(--danger) 100%)"
                      }}
                    />
                  </div>
                </div>
                <span className="status-badge status-danger">ต้องติดตามวันนี้</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="section-card px-6 py-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">Session readiness</h3>
                <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
                  ความพร้อมของแต่ละคลินิกก่อนเปิด session
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {clinicReadiness.map((session) => (
                <div key={session.name} className="surface-strong rounded-[24px] px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-base font-semibold">{session.name}</p>
                    <span className="status-badge status-brand">
                      {session.ready}/{session.total} พร้อม
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--page-bg-soft)]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round((session.ready / session.total) * 100)}%`,
                        background: "linear-gradient(90deg, var(--brand) 0%, var(--success) 100%)"
                      }}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-7" style={{ color: "var(--ink-muted)" }}>
                    {session.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card px-6 py-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">คิวถัดไปในวันนี้</h3>
                <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
                  ใช้คุยระหว่าง nurse station และแพทย์ได้ทันที
                </p>
              </div>
              <span className="status-badge status-brand">{todayAppointments.length} คิว</span>
            </div>

            <div className="mt-5 space-y-3">
              {todayAppointments.map((appointment) => {
                const status = statusLabel(appointment.status)
                return (
                  <div
                    key={appointment.id}
                    className="surface-strong flex flex-wrap items-center justify-between gap-4 rounded-[24px] px-4 py-4"
                  >
                    <div>
                      <p className="text-lg font-semibold">{appointment.timeFrom}</p>
                      <p className="text-xs font-medium" style={{ color: "var(--ink-muted)" }}>
                        {appointment.clinic?.name ?? "คลินิกจิตเวช"}
                      </p>
                    </div>
                    <div className="min-w-[180px] flex-1">
                      <p className="text-base font-semibold">
                        {appointment.patient?.firstName} {appointment.patient?.lastName}
                      </p>
                      <p className="text-xs font-medium" style={{ color: "var(--ink-muted)" }}>
                        นัดติดตามอาการและการใช้ยา
                      </p>
                    </div>
                    <span className={`status-badge ${status.className}`}>{status.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
