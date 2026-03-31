"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { getDashboardStats } from "../api/analytics"
import { getTodayAppointments } from "../api/appointments"
import { getPatients } from "../api/patients"

const fallbackRiskPatients = [
  { id: "1", firstName: "สมชาย", lastName: "พูนสุข", hn: "0001234", riskLevel: "HIGH", totalNoShows: 4, noShowScore: 0.81 },
  { id: "2", firstName: "รัตนา", lastName: "ใจดี", hn: "0001934", riskLevel: "HIGH", totalNoShows: 5, noShowScore: 0.76 },
  { id: "3", firstName: "อารยา", lastName: "มั่นคง", hn: "0002128", riskLevel: "MEDIUM", totalNoShows: 2, noShowScore: 0.46 }
]

const fallbackTodayAppointments = [
  { id: "a1", patient: { firstName: "วิไล", lastName: "ศรีสุข" }, timeFrom: "09:00", clinic: { name: "คลินิกจิตเวชผู้ใหญ่" }, status: "CONFIRMED" },
  { id: "a2", patient: { firstName: "ประเสริฐ", lastName: "ทองมา" }, timeFrom: "10:30", clinic: { name: "คลินิกติดตามยา" }, status: "SCHEDULED" },
  { id: "a3", patient: { firstName: "สุดา", lastName: "คำดี" }, timeFrom: "13:00", clinic: { name: "คลินิกให้คำปรึกษา" }, status: "ATTENDED" }
]

function statusLabel(status: string) {
  if (status === "ATTENDED") return { label: "มาแล้ว", className: "status-success" }
  if (status === "CONFIRMED") return { label: "ยืนยันแล้ว", className: "status-brand" }
  if (status === "NO_SHOW") return { label: "ขาดนัด", className: "status-danger" }
  return { label: "รอดำเนินการ", className: "status-warning" }
}

export function DashboardPage() {
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

  const riskPatients = useMemo(
    () => (Array.isArray(riskData) ? riskData : fallbackRiskPatients),
    [riskData]
  )

  const todayAppointments = useMemo(
    () => (Array.isArray(todayData) ? todayData : fallbackTodayAppointments),
    [todayData]
  )

  return (
    <div className="space-y-6">
      <section className="section-card soft-grid overflow-hidden px-6 py-7 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
          <div>
            <span className="status-badge status-brand">ระบบติดตามนัดหมาย — จิตเวช</span>
            <h2 className="mt-4 text-[34px] font-semibold leading-tight tracking-[-0.03em]">
              หน้าหลักสำหรับดูคิวตรวจ ผู้ป่วยเสี่ยง และงานติดตามในเวรเดียวกัน
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-8" style={{ color: "var(--ink-muted)" }}>
              ออกแบบให้แพทย์และพยาบาลเห็นข้อมูลที่ต้องตัดสินใจได้เร็วขึ้น ตั้งแต่ภาพรวมการมาตามนัด รายชื่อที่ต้องติดตาม ไปจนถึงคิวตรวจวันนี้ของแต่ละคลินิก
            </p>
          </div>

          <div className="surface-strong rounded-[28px] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--brand)" }}>
              Focus Today
            </p>
            <div className="mt-4 space-y-4">
              {[
                "ติดตามผู้ป่วยเสี่ยงสูงก่อนเริ่มคลินิกช่วงเช้า",
                "ตรวจสอบคิวที่ยังไม่ยืนยันก่อนเวลา 10:00 น.",
                "แจ้งทีมพยาบาลสำหรับเคสขาดนัดซ้ำ"
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-[20px] bg-[var(--page-bg-soft)] px-4 py-3">
                  <span
                    className="mt-1 inline-flex h-2.5 w-2.5 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
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
          { label: "รอดำเนินการ", value: todayStats.pending, tone: "status-warning" }
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
              <h3 className="text-2xl font-semibold tracking-[-0.03em]">ผู้ป่วยที่ต้องติดตามใกล้ชิด</h3>
              <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
                เรียงจากความเสี่ยงขาดนัดและจำนวน no-show สะสม
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
                <div className="min-w-[140px]">
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
                <span className="status-badge status-danger">{patient.riskLevel === "HIGH" ? "เสี่ยงสูง" : "เฝ้าระวัง"}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card px-6 py-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-2xl font-semibold tracking-[-0.03em]">ตารางนัดวันนี้</h3>
              <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
                มองคิวที่ต้องรับต่อและสถานะล่าสุดของผู้ป่วย
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
      </section>
    </div>
  )
}
