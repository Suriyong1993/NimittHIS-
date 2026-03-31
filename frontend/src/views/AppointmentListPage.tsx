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

const fallbackAppointments = [
  { id: "1", appointmentDate: "2026-03-31T09:00:00.000Z", timeFrom: "09:00", status: "CONFIRMED", patient: { firstName: "วารุณี", lastName: "บุญมี" }, clinic: { name: "คลินิกจิตเวชผู้ใหญ่" }, doctor: { prefix: "พญ.", firstName: "วารี", lastName: "ดวงดาว" } },
  { id: "2", appointmentDate: "2026-03-31T10:30:00.000Z", timeFrom: "10:30", status: "SCHEDULED", patient: { firstName: "ไพศาล", lastName: "ศรีทอง" }, clinic: { name: "คลินิกติดตามยา" }, doctor: { prefix: "นพ.", firstName: "กมล", lastName: "สุขใจ" } },
  { id: "3", appointmentDate: "2026-03-31T13:15:00.000Z", timeFrom: "13:15", status: "ATTENDED", patient: { firstName: "ศิริพร", lastName: "แก้วดี" }, clinic: { name: "คลินิกให้คำปรึกษา" }, doctor: { prefix: "พญ.", firstName: "ปัทมา", lastName: "เจริญสุข" } }
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
            <h2 className="section-title">รายการนัดหมายประจำวัน</h2>
            <p className="section-subtitle mt-2">
              ใช้ติดตามคิวตรวจ ยืนยันการมารับบริการ และมองหาคิวที่ต้องประสานงานเพิ่มเติม
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

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="section-card overflow-hidden">
          <div className="border-b px-6 py-5" style={{ borderColor: "var(--line)" }}>
            <h3 className="text-xl font-semibold">คิวตรวจและสถานะล่าสุด</h3>
          </div>

          <div className="px-4 py-4 lg:px-6">
            <div className="space-y-3">
              {appointments.map((appointment: AppointmentItem) => {
                const status = appointmentStatus(appointment.status)
                return (
                  <div
                    key={appointment.id}
                    className="surface-strong grid gap-4 rounded-[24px] px-4 py-4 lg:grid-cols-[88px_minmax(0,1fr)_170px_130px]"
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
                        แพทย์ประจำคลินิก
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
            <h3 className="text-xl font-semibold">งานประสานวันนี้</h3>
            <div className="mt-4 space-y-3">
              {[
                "โทรยืนยันผู้ป่วยที่ยังไม่ตอบรับนัดช่วงบ่าย",
                "จัดลำดับคิวแพทย์ตามผู้ป่วยที่ต้องใช้เวลาปรึกษานาน",
                "ตรวจสอบเคสที่มีประวัติขาดนัดต่อเนื่องก่อนส่งเข้าห้องตรวจ"
              ].map((item) => (
                <div key={item} className="rounded-[20px] bg-[var(--page-bg-soft)] px-4 py-3 text-sm leading-7">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="section-card px-6 py-6">
            <h3 className="text-xl font-semibold">ภาพรวมเวร</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {[
                { label: "ยืนยันแล้ว", value: appointments.filter((item: AppointmentItem) => item.status === "CONFIRMED").length, tone: "status-brand" },
                { label: "ตรวจเสร็จ", value: appointments.filter((item: AppointmentItem) => item.status === "ATTENDED").length, tone: "status-success" },
                { label: "ต้องติดตาม", value: appointments.filter((item: AppointmentItem) => item.status === "SCHEDULED").length, tone: "status-warning" }
              ].map((item) => (
                <div key={item.label} className="surface-strong rounded-[22px] px-4 py-4">
                  <span className={`status-badge ${item.tone}`}>{item.label}</span>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
