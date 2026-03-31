"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { getAppointments } from "../api/appointments"

type FilterKey = "all" | "confirmed" | "pending" | "attended"

type AppointmentItem = {
  id: string
  appointmentDate: string
  timeFrom: string
  status: string
  patient?: {
    firstName?: string
    lastName?: string
  }
  clinic?: {
    name?: string
  }
  doctor?: {
    prefix?: string
    firstName?: string
    lastName?: string
  }
}

const filterMap: Record<FilterKey, string | undefined> = {
  all: undefined,
  confirmed: "CONFIRMED",
  pending: "SCHEDULED",
  attended: "ATTENDED"
}

const fallbackAppointments: AppointmentItem[] = [
  { id: "1", appointmentDate: "2026-03-31T09:00:00.000Z", timeFrom: "09:00", status: "CONFIRMED", patient: { firstName: "วารุณี", lastName: "บุญมี" }, clinic: { name: "คลินิกจิตเวชผู้ใหญ่" }, doctor: { prefix: "พญ.", firstName: "วารี", lastName: "ดวงดาว" } },
  { id: "2", appointmentDate: "2026-03-31T10:30:00.000Z", timeFrom: "10:30", status: "SCHEDULED", patient: { firstName: "ไพศาล", lastName: "ศรีทอง" }, clinic: { name: "คลินิกติดตามยา" }, doctor: { prefix: "นพ.", firstName: "กมล", lastName: "สุขใจ" } },
  { id: "3", appointmentDate: "2026-03-31T13:15:00.000Z", timeFrom: "13:15", status: "ATTENDED", patient: { firstName: "ศิริพร", lastName: "แก้วดี" }, clinic: { name: "คลินิกให้คำปรึกษา" }, doctor: { prefix: "พญ.", firstName: "ปัทมา", lastName: "เจริญสุข" } }
]

const sessionSummary = [
  { clinic: "คลินิกจิตเวชผู้ใหญ่", doctor: "พญ.วารี ดวงดาว", room: "ห้อง 3", confirmed: 9, total: 12, waiting: 2 },
  { clinic: "คลินิกติดตามยา", doctor: "นพ.กมล สุขใจ", room: "ห้อง 5", confirmed: 6, total: 8, waiting: 1 },
  { clinic: "คลินิกให้คำปรึกษา", doctor: "พญ.ปัทมา เจริญสุข", room: "ห้อง 2", confirmed: 3, total: 4, waiting: 0 }
]

function appointmentStatus(status: string) {
  if (status === "ATTENDED") return { label: "ตรวจเสร็จ", className: "status-success" }
  if (status === "CONFIRMED") return { label: "ยืนยันแล้ว", className: "status-brand" }
  if (status === "NO_SHOW") return { label: "ขาดนัด", className: "status-danger" }
  return { label: "รอรับบริการ", className: "status-warning" }
}

export function AppointmentListPage() {
  const [filter, setFilter] = useState<FilterKey>("all")

  const { data } = useQuery({
    queryKey: ["appointments", filter],
    queryFn: () => getAppointments({ status: filterMap[filter], limit: 20 }),
    retry: false
  })

  const appointments = useMemo<AppointmentItem[]>(() => {
    if (Array.isArray(data?.data)) {
      return data.data as AppointmentItem[]
    }
    return fallbackAppointments
  }, [data])

  return (
    <div className="space-y-6">
      <section className="section-card px-6 py-6 lg:px-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="section-title">Appointment Operations</h2>
            <p className="section-subtitle mt-2">
              มองทั้ง session capacity, ภาระแพทย์ และคิวรายบุคคลในหน้าจอเดียว เพื่อให้ nurse station จัด flow ได้ง่ายขึ้น
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "ทั้งหมด" },
              { key: "confirmed", label: "ยืนยันแล้ว" },
              { key: "pending", label: "รอดำเนินการ" },
              { key: "attended", label: "ตรวจเสร็จ" }
            ].map((item) => (
              <button
                key={item.key}
                className="tap-soft rounded-full px-4 py-2 text-sm font-semibold"
                style={
                  filter === item.key
                    ? { background: "var(--brand)", color: "white" }
                    : { background: "var(--surface-strong)", color: "var(--ink-soft)", border: "1px solid var(--line)" }
                }
                onClick={() => setFilter(item.key as FilterKey)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {sessionSummary.map((session) => (
          <div key={session.clinic} className="section-card px-5 py-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold">{session.clinic}</h3>
                <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
                  {session.doctor} • {session.room}
                </p>
              </div>
              <span className="status-badge status-brand">
                {session.confirmed}/{session.total} ยืนยัน
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--page-bg-soft)]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.round((session.confirmed / session.total) * 100)}%`,
                  background: "linear-gradient(90deg, var(--brand) 0%, var(--success) 100%)"
                }}
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-[20px] bg-[var(--page-bg-soft)] px-3 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-muted)" }}>Capacity</p>
                <p className="mt-2 text-2xl font-semibold">{session.total}</p>
              </div>
              <div className="rounded-[20px] bg-[var(--page-bg-soft)] px-3 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-muted)" }}>Waiting</p>
                <p className="mt-2 text-2xl font-semibold">{session.waiting}</p>
              </div>
              <div className="rounded-[20px] bg-[var(--page-bg-soft)] px-3 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-muted)" }}>Load</p>
                <p className="mt-2 text-2xl font-semibold">{Math.round((session.confirmed / session.total) * 100)}%</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="section-card overflow-hidden">
          <div className="border-b px-6 py-5" style={{ borderColor: "var(--line)" }}>
            <h3 className="text-xl font-semibold">คิวตรวจและสถานะล่าสุด</h3>
          </div>

          <div className="px-4 py-4 lg:px-6">
            <div className="space-y-3">
              {appointments.map((appointment) => {
                const status = appointmentStatus(appointment.status)
                return (
                  <div
                    key={appointment.id}
                    className="surface-strong grid gap-4 rounded-[24px] px-4 py-4 lg:grid-cols-[88px_minmax(0,1fr)_190px_130px]"
                  >
                    <div>
                      <p className="text-lg font-semibold">{appointment.timeFrom}</p>
                      <p className="mt-1 text-xs font-medium" style={{ color: "var(--ink-muted)" }}>
                        {new Date(appointment.appointmentDate).toLocaleDateString("th-TH")}
                      </p>
                    </div>
                    <div>
                      <p className="text-base font-semibold">
                        {appointment.patient?.firstName} {appointment.patient?.lastName}
                      </p>
                      <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
                        {appointment.clinic?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {appointment.doctor?.prefix} {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                      </p>
                      <p className="mt-1 text-xs font-medium" style={{ color: "var(--ink-muted)" }}>
                        session workload monitoring
                      </p>
                    </div>
                    <div className="flex items-center lg:justify-end">
                      <span className={`status-badge ${status.className}`}>{status.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="section-card px-6 py-6">
            <h3 className="text-xl font-semibold">งานประสานเวร</h3>
            <div className="mt-4 space-y-3">
              {[
                "ล็อกคิว room ที่มีแพทย์ล่าช้ากว่าเวลาเกิน 15 นาที",
                "คิวเสี่ยงขาดนัดให้แยกไว้ก่อนเพื่อโทรติดตามทันที",
                "ถ้าผู้ป่วย walk-in ให้เทียบ session capacity ก่อนใส่คิว"
              ].map((item) => (
                <div key={item} className="rounded-[20px] bg-[var(--page-bg-soft)] px-4 py-3 text-sm leading-7">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="section-card px-6 py-6">
            <h3 className="text-xl font-semibold">โหลดแพทย์</h3>
            <div className="mt-4 space-y-3">
              {sessionSummary.map((session) => (
                <div key={session.doctor} className="surface-strong rounded-[22px] px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{session.doctor}</p>
                    <span className="status-badge status-warning">{session.waiting} รอคิว</span>
                  </div>
                  <p className="mt-2 text-xs font-medium" style={{ color: "var(--ink-muted)" }}>
                    {session.clinic}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
