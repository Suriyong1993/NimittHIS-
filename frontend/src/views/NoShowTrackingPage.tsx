"use client"

import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { getOverdueAppointments } from "../api/appointments"
import { getPatients } from "../api/patients"
import { createFollowUpNote } from "../api/timeline"
import { Button } from "../components/ui/Button"

type BoardCard = {
  id: string
  patientId: string
  title: string
  subtitle: string
  detail: string
  tag: string
  lane: "call" | "contacted" | "rescheduled" | "overdue"
}

const fallbackRisk = [
  { id: "1", firstName: "สมชาย", lastName: "พูลสุข", hn: "0001234", totalNoShows: 4, noShowScore: 0.81, phone: "0812345678" },
  { id: "2", firstName: "รัตนา", lastName: "ใจดี", hn: "0001934", totalNoShows: 5, noShowScore: 0.74, phone: "0823456789" }
]

const fallbackOverdue = [
  { id: "o1", timeFrom: "09:00", patient: { firstName: "ชูศรี", lastName: "รักษ์สุข" }, clinic: { name: "คลินิกจิตเวชผู้ใหญ่" } },
  { id: "o2", timeFrom: "11:00", patient: { firstName: "มนัส", lastName: "คำดี" }, clinic: { name: "คลินิกติดตามยา" } }
]

export function NoShowTrackingPage() {
  const queryClient = useQueryClient()
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
      patientId: patient.id,
      title: `${patient.firstName} ${patient.lastName}`,
      subtitle: `HN ${patient.hn} • โทร ${patient.phone ?? "-"}`,
      detail: `ขาดนัดสะสม ${patient.totalNoShows} ครั้ง • score ${Math.round(patient.noShowScore * 100)}%`,
      tag: "เสี่ยงสูง",
      lane: "call"
    }))

    const contacted: BoardCard[] = [
      {
        id: "contacted-1",
        patientId: "contacted-1",
        title: "วิไล รักษ์ดี",
        subtitle: "ญาติรับสายแล้ว",
        detail: "ขอเลื่อนมาวันศุกร์ช่วงเช้า เนื่องจากเดินทางไม่สะดวก",
        tag: "กำลังประสาน",
        lane: "contacted"
      }
    ]

    const rescheduled: BoardCard[] = [
      {
        id: "reschedule-1",
        patientId: "reschedule-1",
        title: "ประเสริฐ วงค์ดี",
        subtitle: "เลื่อนนัดสำเร็จ",
        detail: "ย้ายนัดเป็น 4 เม.ย. 2569 พร้อม note ให้ติดตามยา",
        tag: "กลับเข้าระบบ",
        lane: "rescheduled"
      }
    ]

    const overdueLane: BoardCard[] = overduePatients.map((appointment) => ({
      id: `overdue-${appointment.id}`,
      patientId: appointment.id,
      title: `${appointment.patient?.firstName} ${appointment.patient?.lastName}`,
      subtitle: `${appointment.clinic?.name} • ${appointment.timeFrom}`,
      detail: "ยังไม่มีการอัปเดตสถานะ ต้องตรวจสอบกับหน้าห้องและบันทึกผล",
      tag: "คิวค้าง",
      lane: "overdue"
    }))

    return [
      { key: "call", label: "ต้องโทรวันนี้", tone: "status-danger", items: toCallToday },
      { key: "contacted", label: "ติดต่อแล้ว", tone: "status-warning", items: contacted },
      { key: "rescheduled", label: "กลับเข้าระบบแล้ว", tone: "status-success", items: rescheduled },
      { key: "overdue", label: "รออัปเดตสถานะ", tone: "status-brand", items: overdueLane }
    ]
  }, [overduePatients, riskPatients])

  const initialCards = useMemo(() => board.flatMap((lane) => lane.items), [board])
  const [cards, setCards] = useState<BoardCard[]>(initialCards)

  useEffect(() => {
    setCards(initialCards)
  }, [initialCards])

  const followUpMutation = useMutation({
    mutationFn: ({ patientId, notes }: { patientId: string; notes: string }) => createFollowUpNote(patientId, notes),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["noshow"] })
    }
  })

  const laneMeta = [
    { key: "call", label: "ต้องโทรวันนี้", tone: "status-danger" },
    { key: "contacted", label: "ติดต่อแล้ว", tone: "status-warning" },
    { key: "rescheduled", label: "กลับเข้าระบบแล้ว", tone: "status-success" },
    { key: "overdue", label: "รออัปเดตสถานะ", tone: "status-brand" }
  ] as const

  const boardByLane = laneMeta.map((lane) => ({
    ...lane,
    items: cards.filter((item) => item.lane === lane.key)
  }))

  function moveCard(cardId: string, lane: BoardCard["lane"], tag: string, detailPrefix: string) {
    setCards((current) =>
      current.map((item) =>
        item.id === cardId
          ? {
              ...item,
              lane,
              tag,
              detail: `${detailPrefix} • ${item.detail}`
            }
          : item
      )
    )
  }

  async function markCalled(card: BoardCard) {
    moveCard(card.id, "contacted", "กำลังประสาน", "บันทึกว่าติดต่อผู้ป่วยหรือญาติแล้ว")
    if (card.patientId.startsWith("o") || card.patientId.includes("contacted") || card.patientId.includes("reschedule")) {
      return
    }
    await followUpMutation.mutateAsync({
      patientId: card.patientId,
      notes: `โทรติดตามผู้ป่วย ${card.title} แล้ว อยู่ระหว่างประสานการมารับบริการ`
    })
  }

  async function markRescheduled(card: BoardCard) {
    moveCard(card.id, "rescheduled", "กลับเข้าระบบ", "บันทึกว่าเลื่อนนัดและกลับเข้าสู่แผนการรักษาแล้ว")
    if (card.patientId.startsWith("o") || card.patientId.includes("contacted") || card.patientId.includes("reschedule")) {
      return
    }
    await followUpMutation.mutateAsync({
      patientId: card.patientId,
      notes: `จัดการ follow-up และเลื่อนนัดสำหรับ ${card.title} เรียบร้อยแล้ว`
    })
  }

  return (
    <div className="space-y-4 md:space-y-5 xl:space-y-6">
      <section className="section-card px-5 py-6 md:px-7 xl:px-8">
        <div className="panel-head gap-4">
          <div className="max-w-3xl">
            <span className="eyebrow">Outreach Board</span>
            <h2 className="mt-4 text-[28px] font-semibold tracking-[-0.04em] md:text-[36px]">
              เปลี่ยนงานติดตามขาดนัดให้กลายเป็นเคสที่ปิดงานได้จริง
            </h2>
            <p className="mt-3 text-sm leading-8 md:text-[15px]" style={{ color: "var(--ink-muted)" }}>
              มุมมองนี้ช่วยให้ทีมพยาบาลและ case manager จัดลำดับความเสี่ยง โทรติดตาม และย้ายผู้ป่วยกลับเข้าสู่แผนการรักษาได้เป็นขั้นตอน
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "ต้องโทรวันนี้", value: boardByLane[0].items.length },
              { label: "กำลังประสาน", value: boardByLane[1].items.length },
              { label: "กลับเข้าระบบ", value: boardByLane[2].items.length },
              { label: "คิวค้าง", value: boardByLane[3].items.length }
            ].map((item) => (
              <div key={item.label} className="soft-block min-w-[120px] px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-muted)" }}>
                  {item.label}
                </p>
                <p className="mt-3 text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-grid xl:grid-cols-4">
        {boardByLane.map((lane) => (
          <div key={lane.key} className="section-card px-4 py-4 md:px-5">
            <div className="flex items-center justify-between gap-2">
              <span className={`status-badge ${lane.tone}`}>{lane.label}</span>
              <span className="text-sm font-semibold" style={{ color: "var(--ink-muted)" }}>
                {lane.items.length}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {lane.items.length === 0 ? (
                <div className="soft-block px-4 py-5 text-sm" style={{ color: "var(--ink-muted)" }}>
                  ไม่มีรายการในคอลัมน์นี้
                </div>
              ) : (
                lane.items.map((item) => (
                  <div key={item.id} className="surface-strong rounded-[24px] px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold leading-6">{item.title}</p>
                      <span className="status-badge status-brand">{item.tag}</span>
                    </div>
                    <p className="mt-2 text-xs font-medium" style={{ color: "var(--ink-muted)" }}>
                      {item.subtitle}
                    </p>
                    <p className="mt-3 text-sm leading-7">{item.detail}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.lane === "call" ? (
                        <>
                          <Button size="sm" onClick={() => void markCalled(item)} loading={followUpMutation.isPending}>
                            บันทึกว่าติดต่อแล้ว
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => void markRescheduled(item)}>
                            เลื่อนนัดแล้ว
                          </Button>
                        </>
                      ) : null}
                      {item.lane === "contacted" ? (
                        <Button size="sm" onClick={() => void markRescheduled(item)}>
                          ย้ายไปกลับเข้าระบบ
                        </Button>
                      ) : null}
                      {item.lane === "overdue" ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => moveCard(item.id, "contacted", "กำลังประสาน", "หน้าห้องตรวจสอบแล้วและส่งต่อทีมติดตาม")}
                        >
                          ส่งต่อทีมติดตาม
                        </Button>
                      ) : null}
                    </div>
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
