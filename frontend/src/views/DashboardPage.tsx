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
  { id: "1", firstName: "สมชาย", lastName: "พูลสุข", hn: "0001234", riskLevel: "HIGH", totalNoShows: 4, noShowScore: 0.81 },
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
  "ตรวจสอบคิวที่ยังไม่มาถึงและอัปเดตสถานะหน้าห้องตรวจ",
  "เตรียมแบบคัดกรองสั้นสำหรับผู้ป่วยที่มีประวัติขาดนัดซ้ำ"
]

const doctorTasks = [
  "ทบทวน continuity summary ของเคสเสี่ยงก่อนเริ่ม session แรก",
  "ดู medication continuity ในผู้ป่วยที่ยากำลังจะหมดก่อนนัดถัดไป",
  "วางแผน follow-up mode สำหรับผู้ป่วยที่ adherence ต่ำ"
]

const managerTasks = [
  "ตรวจ backlog ทีมติดตามที่ยังไม่ปิดภายใน 3 วัน",
  "ดู no-show ราย session เพื่อปรับกำลังคนสัปดาห์หน้า",
  "เฝ้าระวังคิวที่ค้างอัปเดตสถานะเกินเวลา"
]

function statusLabel(status: string) {
  if (status === "ATTENDED") return { label: "มาตามนัดแล้ว", className: "status-success" }
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
    { name: "คลินิกจิตเวชผู้ใหญ่", ready: 9, total: 12, note: "มีผู้ป่วยเสี่ยงสูง 2 รายต้องยืนยันก่อนเข้า session" },
    { name: "คลินิกติดตามยา", ready: 6, total: 8, note: "ค้างยืนยัน 1 รายและมีผู้ป่วยยากำลังหมด" },
    { name: "คลินิกให้คำปรึกษา", ready: 3, total: 4, note: "session บ่ายเริ่ม 13:00 น. ทีมพร้อมแล้ว" }
  ]

  return (
    <div className="space-y-4 md:space-y-5 xl:space-y-6">
      <section className="section-card soft-grid overflow-hidden px-5 py-6 md:px-7 md:py-7 xl:px-8">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_360px]">
          <div>
            <span className="eyebrow">Morning Command Center</span>
            <h2 className="mt-4 max-w-4xl text-[30px] font-semibold leading-tight tracking-[-0.04em] md:text-[38px]">
              ภาพรวมที่ช่วยให้ทีม {roleLabel(user?.role)} ตัดสินใจเร็วขึ้นก่อนเริ่มคลินิก
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-8 md:text-[15px]" style={{ color: "var(--ink-muted)" }}>
              จัดลำดับงานสำคัญของเวรวันนี้ให้เห็นชัดในหน้าเดียว ทั้งคิวตรวจ ผู้ป่วยเสี่ยงขาดนัด ความพร้อมของ session และงานติดตามที่ยังไม่ควรตกหล่น
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="soft-block px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-muted)" }}>
                  เวรวันนี้
                </p>
                <p className="mt-3 text-2xl font-semibold">{todayStats.total} คิว</p>
                <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
                  รวมคิวที่ต้องดูแลทั้งวัน
                </p>
              </div>
              <div className="soft-block px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-muted)" }}>
                  เสี่ยง outreach
                </p>
                <p className="mt-3 text-2xl font-semibold">{riskPatients.length} ราย</p>
                <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
                  ควรติดตามหรือยืนยันก่อน
                </p>
              </div>
              <div className="soft-block px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-muted)" }}>
                  ค้างอัปเดต
                </p>
                <p className="mt-3 text-2xl font-semibold">{todayStats.pending} รายการ</p>
                <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
                  ต้องปิดสถานะให้จบในเวร
                </p>
              </div>
            </div>
          </div>

          <div className="surface-strong rounded-[30px] p-5 md:p-6">
            <div className="panel-head">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--brand)" }}>
                  Focus For {roleLabel(user?.role)}
                </p>
                <h3 className="mt-2 text-xl font-semibold">งานที่ควรทำก่อน</h3>
              </div>
              <span className="status-badge status-brand">เริ่มเวร</span>
            </div>

            <div className="mt-4 space-y-3">
              {roleTasks.map((item, index) => (
                <div key={item} className="soft-block flex gap-3 px-4 py-4">
                  <span
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ background: index === 0 ? "var(--brand)" : "var(--brand-sky)" }}
                  >
                    {index + 1}
                  </span>
                  <p className="text-sm leading-7">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="content-grid md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "นัดหมายวันนี้", value: todayStats.total, tone: "status-brand" },
          { label: "มาตามนัดแล้ว", value: todayStats.attended, tone: "status-success" },
          { label: "ขาดนัด", value: todayStats.noShow, tone: "status-danger" },
          { label: "ค้างอัปเดต", value: todayStats.pending, tone: "status-warning" }
        ].map((item) => (
          <div key={item.label} className="metric-card">
            <span className={`status-badge ${item.tone}`}>{item.label}</span>
            <p className="metric-value">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="content-grid xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
        <div className="section-card px-5 py-5 md:px-6 md:py-6">
          <div className="panel-head">
            <div>
              <h3 className="text-[24px] font-semibold tracking-[-0.03em]">Outreach priority วันนี้</h3>
              <p className="mt-1 text-sm leading-7" style={{ color: "var(--ink-muted)" }}>
                ผู้ป่วยที่ควรได้รับการโทรติดตามหรือยืนยันนัดก่อนหลุดจากแผนการรักษา
              </p>
            </div>
            <span className="status-badge status-warning">{riskPatients.length} ราย</span>
          </div>

          <div className="mt-5 space-y-3">
            {riskPatients.map((patient) => (
              <div
                key={patient.id}
                className="surface-strong grid gap-4 rounded-[26px] px-4 py-4 md:grid-cols-[64px_minmax(0,1fr)_190px]"
              >
                <div
                  className="inline-flex h-14 w-14 items-center justify-center rounded-[22px] text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, var(--danger) 0%, #ee8a98 100%)" }}
                >
                  {patient.firstName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <span className="status-badge status-danger">ต้องติดตาม</span>
                  </div>
                  <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
                    HN {patient.hn} • ขาดนัดสะสม {patient.totalNoShows} ครั้ง
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-muted)" }}>
                    No-show score
                  </p>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[var(--page-bg-soft)]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round(patient.noShowScore * 100)}%`,
                        background: "linear-gradient(90deg, var(--warning) 0%, var(--danger) 100%)"
                      }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium" style={{ color: "var(--ink-soft)" }}>
                    {Math.round(patient.noShowScore * 100)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 md:space-y-5">
          <div className="section-card px-5 py-5 md:px-6 md:py-6">
            <div className="panel-head">
              <div>
                <h3 className="text-[24px] font-semibold tracking-[-0.03em]">Session readiness</h3>
                <p className="mt-1 text-sm leading-7" style={{ color: "var(--ink-muted)" }}>
                  ความพร้อมของคลินิกก่อนเปิดห้องตรวจ
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {clinicReadiness.map((session) => (
                <div key={session.name} className="surface-strong rounded-[24px] px-4 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-base font-semibold">{session.name}</p>
                    <span className="status-badge status-brand">
                      {session.ready}/{session.total} พร้อม
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[var(--page-bg-soft)]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round((session.ready / session.total) * 100)}%`,
                        background: "linear-gradient(90deg, var(--brand) 0%, var(--accent) 100%)"
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

          <div className="section-card px-5 py-5 md:px-6 md:py-6">
            <div className="panel-head">
              <div>
                <h3 className="text-[24px] font-semibold tracking-[-0.03em]">คิวถัดไป</h3>
                <p className="mt-1 text-sm leading-7" style={{ color: "var(--ink-muted)" }}>
                  ใช้คุยระหว่าง nurse station และแพทย์ได้ทันที
                </p>
              </div>
              <span className="status-badge status-brand">{todayAppointments.length} คิว</span>
            </div>

            <div className="mt-4 space-y-3">
              {todayAppointments.map((appointment) => {
                const status = statusLabel(appointment.status)
                return (
                  <div
                    key={appointment.id}
                    className="surface-strong grid gap-3 rounded-[24px] px-4 py-4 md:grid-cols-[78px_minmax(0,1fr)_auto] md:items-center"
                  >
                    <div>
                      <p className="text-xl font-semibold">{appointment.timeFrom}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-semibold">
                        {appointment.patient?.firstName} {appointment.patient?.lastName}
                      </p>
                      <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
                        {appointment.clinic?.name ?? "คลินิกจิตเวช"}
                      </p>
                    </div>
                    <div className="md:justify-self-end">
                      <span className={`status-badge ${status.className}`}>{status.label}</span>
                    </div>
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
