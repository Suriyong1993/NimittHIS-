"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { getOverdueAppointments } from "../api/appointments"
import { getPatients } from "../api/patients"

type BoardCard = {
  id: string
  title: string
  subtitle: string
  detail: string
  tag: string
}

const fallbackRisk = [
  { id: "1", firstName: "สมชาย", lastName: "พูนสุข", hn: "0001234", totalNoShows: 4, noShowScore: 0.81, phone: "0812345678" },
  { id: "2", firstName: "รัตนา", lastName: "ใจดี", hn: "0001934", totalNoShows: 5, noShowScore: 0.74, phone: "0823456789" }
]

const fallbackOverdue = [
  { id: "o1", timeFrom: "09:00", patient: { firstName: "ชูศรี", lastName: "รักษ์สุข" }, clinic: { name: "คลินิกจิตเวชผู้ใหญ่" } },
  { id: "o2", timeFrom: "11:00", patient: { firstName: "มนัส", lastName: "คำดี" }, clinic: { name: "คลินิกติดตามยา" } }
]

export function NoShowTrackingPage() {
  const { data: riskData } = useQuery({
    queryKey: ["noshow", "risk"],
    queryFn: () => getPatients({ riskLevel: "HIGH", limit: 10 }),
    retry: false
  })

  const { data: overdueData } = useQuery({
    queryKey: ["noshow", "overdue"],
    queryFn: getOverdueAppointments,
    retry: false
  })

  const riskPatients = useMemo(() => (Array.isArray(riskData) ? riskData : fallbackRisk), [riskData])
  const overduePatients = useMemo(() => (Array.isArray(overdueData) ? overdueData : fallbackOverdue), [overdueData])

  const board = useMemo(() => {
    const toCallToday: BoardCard[] = riskPatients.map((patient) => ({
      id: `call-${patient.id}`,
      title: `${patient.firstName} ${patient.lastName}`,
      subtitle: `HN ${patient.hn} • โทร ${patient.phone ?? "-"}`,
      detail: `ขาดนัดสะสม ${patient.totalNoShows} ครั้ง • score ${Math.round(patient.noShowScore * 100)}%`,
      tag: "เสี่ยงสูง"
    }))

    const contacted: BoardCard[] = [
      {
        id: "contacted-1",
        title: "วิไล รักษ์ดี",
        subtitle: "ญาติรับสายแล้ว",
        detail: "ขอเลื่อนมาวันศุกร์ช่วงเช้า เนื่องจากเดินทางไม่สะดวก",
        tag: "กำลังประสาน"
      }
    ]

    const rescheduled: BoardCard[] = [
      {
        id: "reschedule-1",
        title: "ประเสริฐ วงค์ดี",
        subtitle: "เลื่อนนัดสำเร็จ",
        detail: "ย้ายนัดเป็น 4 เม.ย. 2569 พร้อม note ให้ติดตามยา",
        tag: "กลับเข้าระบบ"
      }
    ]

    const overdueLane: BoardCard[] = overduePatients.map((appointment) => ({
      id: `overdue-${appointment.id}`,
      title: `${appointment.patient?.firstName} ${appointment.patient?.lastName}`,
      subtitle: `${appointment.clinic?.name} • ${appointment.timeFrom}`,
      detail: "ยังไม่มีการอัปเดตสถานะ ต้องตรวจสอบกับหน้าห้องและบันทึกผล",
      tag: "คิวค้าง"
    }))

    return [
      { key: "call", label: "ต้องโทรวันนี้", tone: "status-danger", items: toCallToday },
      { key: "contacted", label: "ติดต่อแล้ว", tone: "status-warning", items: contacted },
      { key: "rescheduled", label: "กลับเข้าระบบแล้ว", tone: "status-success", items: rescheduled },
      { key: "overdue", label: "รออัปเดตสถานะ", tone: "status-brand", items: overdueLane }
    ]
  }, [overduePatients, riskPatients])

  return (
    <div className="space-y-6">
      <section className="section-card px-6 py-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="section-title">Outreach Board</h2>
            <p className="section-subtitle mt-2">
              เปลี่ยนการติดตามขาดนัดจาก “รายชื่อ” ให้กลายเป็น “งานที่ต้องปิด” เพื่อให้พยาบาลและทีม case management ไล่เคสได้จนจบ
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="surface-strong rounded-[22px] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-muted)" }}>ต้องโทรวันนี้</p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{board[0].items.length}</p>
            </div>
            <div className="surface-strong rounded-[22px] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-muted)" }}>กำลังประสาน</p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{board[1].items.length}</p>
            </div>
            <div className="surface-strong rounded-[22px] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-muted)" }}>กลับเข้าระบบ</p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{board[2].items.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {board.map((lane) => (
          <div key={lane.key} className="section-card px-4 py-4">
            <div className="flex items-center justify-between gap-2">
              <span className={`status-badge ${lane.tone}`}>{lane.label}</span>
              <span className="text-sm font-semibold" style={{ color: "var(--ink-muted)" }}>
                {lane.items.length}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {lane.items.length === 0 ? (
                <div className="rounded-[20px] bg-[var(--page-bg-soft)] px-4 py-5 text-sm" style={{ color: "var(--ink-muted)" }}>
                  ไม่มีรายการในคอลัมน์นี้
                </div>
              ) : (
                lane.items.map((item) => (
                  <div key={item.id} className="surface-strong rounded-[22px] px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold leading-6">{item.title}</p>
                      <span className="status-badge status-brand">{item.tag}</span>
                    </div>
                    <p className="mt-2 text-xs font-medium" style={{ color: "var(--ink-muted)" }}>
                      {item.subtitle}
                    </p>
                    <p className="mt-3 text-sm leading-7">{item.detail}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
