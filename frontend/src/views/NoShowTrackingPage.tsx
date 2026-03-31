"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { getOverdueAppointments } from "../api/appointments"
import { getPatients } from "../api/patients"

type Tab = "risk" | "overdue"

const fallbackRisk = [
  { id: "1", firstName: "สมชาย", lastName: "พูนสุข", hn: "0001234", totalNoShows: 4, noShowScore: 0.81, phone: "0812345678" },
  { id: "2", firstName: "รัตนา", lastName: "ใจดี", hn: "0001934", totalNoShows: 5, noShowScore: 0.74, phone: "0823456789" }
]

const fallbackOverdue = [
  { id: "o1", timeFrom: "09:00", patient: { firstName: "ชูศรี", lastName: "รักษ์สุข" }, clinic: { name: "คลินิกจิตเวชผู้ใหญ่" } },
  { id: "o2", timeFrom: "11:00", patient: { firstName: "มนัส", lastName: "คำดี" }, clinic: { name: "คลินิกติดตามยา" } }
]

export function NoShowTrackingPage() {
  const [tab, setTab] = useState<Tab>("risk")

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

  return (
    <div className="space-y-6">
      <section className="section-card px-6 py-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="section-title">ติดตามผู้ป่วยขาดนัด</h2>
            <p className="section-subtitle mt-2">
              จัดลำดับการติดตามผู้ป่วยที่มีความเสี่ยง เพื่อช่วยลด no-show และรักษาความต่อเนื่องของการดูแล
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="surface-strong rounded-[22px] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-muted)" }}>
                กลุ่มเสี่ยงสูง
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{riskPatients.length}</p>
            </div>
            <div className="surface-strong rounded-[22px] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-muted)" }}>
                ยังไม่อัปเดตสถานะ
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{overduePatients.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-card overflow-hidden">
        <div className="flex gap-2 border-b px-5 py-4" style={{ borderColor: "var(--line)" }}>
          {[
            { key: "risk", label: "ผู้ป่วยเสี่ยงสูง" },
            { key: "overdue", label: "คิวที่ยังไม่อัปเดต" }
          ].map((item) => (
            <button
              key={item.key}
              className="tap-soft rounded-full px-4 py-2 text-sm font-semibold"
              style={
                tab === item.key
                  ? { background: "var(--brand)", color: "white" }
                  : { background: "var(--page-bg-soft)", color: "var(--ink-soft)" }
              }
              onClick={() => setTab(item.key as Tab)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="px-5 py-5 lg:px-6">
          {tab === "risk" ? (
            <div className="space-y-3">
              {riskPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="surface-strong grid gap-4 rounded-[24px] px-4 py-4 lg:grid-cols-[minmax(0,1fr)_160px_140px_140px]"
                >
                  <div>
                    <p className="text-base font-semibold">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
                      HN {patient.hn} • โทร {patient.phone ?? "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "var(--ink-muted)" }}>
                      ขาดนัดสะสม
                    </p>
                    <p className="mt-2 text-2xl font-semibold">{patient.totalNoShows}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "var(--ink-muted)" }}>
                      คะแนนเสี่ยง
                    </p>
                    <p className="mt-2 text-2xl font-semibold">{Math.round(patient.noShowScore * 100)}%</p>
                  </div>
                  <div className="flex items-center lg:justify-end">
                    <span className="status-badge status-danger">ติดตามทันที</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {overduePatients.map((appointment) => (
                <div
                  key={appointment.id}
                  className="surface-strong grid gap-4 rounded-[24px] px-4 py-4 lg:grid-cols-[90px_minmax(0,1fr)_180px_140px]"
                >
                  <div>
                    <p className="text-lg font-semibold">{appointment.timeFrom}</p>
                    <p className="mt-1 text-xs font-medium" style={{ color: "var(--ink-muted)" }}>
                      วันนี้
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
                    <p className="text-xs font-semibold" style={{ color: "var(--ink-muted)" }}>
                      งานต่อเนื่อง
                    </p>
                    <p className="mt-1 text-sm leading-7">ตรวจสอบสถานะกับหน้าห้องและโทรติดตามหากยังไม่มา</p>
                  </div>
                  <div className="flex items-center lg:justify-end">
                    <span className="status-badge status-warning">รออัปเดต</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
