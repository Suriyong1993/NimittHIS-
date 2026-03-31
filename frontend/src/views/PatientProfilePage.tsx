"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { getPatientById, getPatientStats, getPatientTimeline } from "../api/patients"
import { Button } from "../components/ui/Button"

interface PatientProfilePageProps {
  patientId: string
}

type TimelineRecord = {
  id: string
  type: string
  entryDate: string
  notes?: string
  clinicName?: string
  doctorName?: string
}

const fallbackPatient = {
  id: "fallback",
  hn: "0001234",
  firstName: "สมชาย",
  lastName: "พูนสุข",
  gender: "ชาย",
  phone: "0812345678",
  insuranceType: "บัตรทอง",
  bloodType: "B+",
  allergies: ["Haloperidol"],
  totalAppointments: 12,
  totalAttended: 7,
  totalNoShows: 4,
  noShowScore: 0.81,
  riskLevel: "HIGH"
}

const fallbackStats = {
  totalAppointments: 12,
  totalAttended: 7,
  totalNoShows: 4,
  noShowScore: 0.81,
  riskLevel: "HIGH",
  attendanceRate: 58,
  lastAppointment: "2026-03-12T09:00:00.000Z",
  nextAppointment: "2026-04-05T09:00:00.000Z"
}

const fallbackTimeline: TimelineRecord[] = [
  {
    id: "t1",
    type: "PHONE_FOLLOWUP",
    entryDate: "2026-03-27T10:00:00.000Z",
    notes: "พยาบาลโทรยืนยันนัด ญาติแจ้งว่าจะพามาตามนัด",
    clinicName: "คลินิกจิตเวชผู้ใหญ่",
    doctorName: "พญ.วารี ดวงดาว"
  },
  {
    id: "t2",
    type: "NO_SHOW",
    entryDate: "2026-03-12T13:30:00.000Z",
    notes: "ขาดนัดเนื่องจากเดินทางไม่สะดวก ต้องติดตามซ้ำภายใน 3 วัน",
    clinicName: "คลินิกติดตามยา",
    doctorName: "นพ.กมล สุขใจ"
  },
  {
    id: "t3",
    type: "MEDICATION",
    entryDate: "2026-02-18T11:15:00.000Z",
    notes: "ปรับยา SSRI และนัดติดตามอาการหลังเริ่มยาใหม่",
    clinicName: "คลินิกจิตเวชผู้ใหญ่",
    doctorName: "พญ.ปัทมา เจริญสุข"
  }
]

const adherenceWidgets = [
  { title: "Medication adherence", value: "76%", note: "ยังมี missed doses เป็นบางวันช่วงสัปดาห์ก่อน", tone: "status-warning" },
  { title: "Caregiver contactability", value: "ดี", note: "ติดต่อผู้ดูแลได้ช่วงเช้าและวันทำการ", tone: "status-success" },
  { title: "Safety follow-up", value: "ติดตามต่อ", note: "ถ้าไม่มาตามนัดต้องโทรกลับภายใน 24-72 ชม.", tone: "status-danger" }
]

const assignedTasks = [
  { owner: "พยาบาลคลินิก", task: "โทรยืนยันก่อนนัด 1 วัน", due: "วันนี้", tone: "status-brand" },
  { owner: "Case manager", task: "ติดตาม barrier เรื่องการเดินทาง", due: "ภายใน 3 วัน", tone: "status-warning" },
  { owner: "แพทย์", task: "ทบทวนการใช้ยาและ adverse effect", due: "visit ถัดไป", tone: "status-success" }
]

function timelineTone(type: string) {
  if (type === "NO_SHOW") return "status-danger"
  if (type === "PHONE_FOLLOWUP") return "status-warning"
  if (type === "MEDICATION" || type === "ATTENDED") return "status-success"
  return "status-brand"
}

function formatThaiDate(value?: string) {
  if (!value) return "-"
  return new Date(value).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric"
  })
}

export function PatientProfilePage({ patientId }: PatientProfilePageProps) {
  const { data: patientData } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => getPatientById(patientId),
    retry: false
  })

  const { data: statsData } = useQuery({
    queryKey: ["patient", patientId, "stats"],
    queryFn: () => getPatientStats(patientId),
    retry: false
  })

  const { data: timelineData } = useQuery({
    queryKey: ["patient", patientId, "timeline"],
    queryFn: () => getPatientTimeline(patientId),
    retry: false
  })

  const patient = patientData ?? fallbackPatient
  const stats = statsData ?? fallbackStats

  const timeline = useMemo<TimelineRecord[]>(
    () => (Array.isArray(timelineData) ? (timelineData as TimelineRecord[]) : fallbackTimeline),
    [timelineData]
  )

  return (
    <div className="space-y-6">
      <section className="section-card px-6 py-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Link
              href="/dashboard"
              className="tap-soft inline-flex h-11 w-11 items-center justify-center rounded-2xl border bg-white"
              style={{ borderColor: "var(--line)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Link>
            <div>
              <span className="status-badge status-brand">Psychiatry Continuity Profile</span>
              <h2 className="mt-3 text-[32px] font-semibold tracking-[-0.03em]">
                {patient.firstName} {patient.lastName}
              </h2>
              <p className="mt-2 text-sm leading-7" style={{ color: "var(--ink-muted)" }}>
                HN {patient.hn} • {patient.gender} • สิทธิรักษา {patient.insuranceType ?? "-"} • โทร {patient.phone ?? "-"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="md">บันทึก Follow-up</Button>
            <Button variant="secondary" size="md">นัดหมายครั้งถัดไป</Button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="section-card px-5 py-5">
            <div
              className="inline-flex h-16 w-16 items-center justify-center rounded-[24px] text-2xl font-semibold text-white"
              style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-strong) 100%)" }}
            >
              {patient.firstName.charAt(0)}
            </div>
            <div className="mt-4 space-y-2">
              <span className={patient.riskLevel === "HIGH" ? "status-badge status-danger" : "status-badge status-warning"}>
                {patient.riskLevel === "HIGH" ? "เสี่ยงขาดนัดสูง" : "เฝ้าระวัง"}
              </span>
              <p className="text-sm leading-7" style={{ color: "var(--ink-muted)" }}>
                ผู้ป่วยรายนี้ควรมีการยืนยันนัดล่วงหน้าและติดตามภายใน 72 ชั่วโมงหากไม่มาตามนัด
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {[
                { label: "มาตามนัด", value: stats.totalAttended },
                { label: "ขาดนัดสะสม", value: stats.totalNoShows },
                { label: "คะแนนเสี่ยง", value: `${Math.round(stats.noShowScore * 100)}%` },
                { label: "อัตรามาตามนัด", value: `${stats.attendanceRate}%` }
              ].map((item) => (
                <div key={item.label} className="rounded-[22px] bg-[var(--page-bg-soft)] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-muted)" }}>
                    {item.label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card px-5 py-5">
            <h3 className="text-xl font-semibold">Medication continuity</h3>
            <div className="mt-4 space-y-3">
              {[
                { name: "Sertraline", dose: "50 mg เช้า", note: "เหลือยาถึงประมาณ 4 เม.ย. 2569" },
                { name: "Lorazepam", dose: "0.5 mg ก่อนนอน", note: "ต้องประเมินการใช้ต่อเนื่องในการนัดหน้า" }
              ].map((item) => (
                <div key={item.name} className="rounded-[22px] bg-[var(--surface-strong)] px-4 py-4" style={{ border: "1px solid var(--line)" }}>
                  <p className="text-base font-semibold">{item.name}</p>
                  <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>{item.dose}</p>
                  <p className="mt-2 text-xs leading-6" style={{ color: "var(--ink-muted)" }}>{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card px-5 py-5">
            <h3 className="text-xl font-semibold">Care coordination</h3>
            <div className="mt-4 space-y-3">
              {[
                "พยาบาลโทรยืนยันก่อนวันนัด 1 วัน",
                "ตรวจสอบผู้ดูแลว่าสามารถพามารับบริการได้หรือไม่",
                "หากไม่มาภายในวันนัด ให้สร้าง outreach task ทันที"
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-[20px] bg-[var(--page-bg-soft)] px-4 py-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full" style={{ background: "var(--brand)" }} />
                  <p className="text-sm leading-7">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card px-5 py-5">
            <h3 className="text-xl font-semibold">Assigned care tasks</h3>
            <div className="mt-4 space-y-3">
              {assignedTasks.map((item) => (
                <div key={`${item.owner}-${item.task}`} className="rounded-[22px] bg-[var(--surface-strong)] px-4 py-4" style={{ border: "1px solid var(--line)" }}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{item.owner}</p>
                    <span className={`status-badge ${item.tone}`}>{item.due}</span>
                  </div>
                  <p className="mt-3 text-sm leading-7">{item.task}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="section-card px-6 py-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">Clinical continuity summary</h3>
                <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
                  ภาพรวมสำหรับแพทย์ พยาบาล และทีมติดตาม ก่อนเริ่มการดูแลใน visit นี้
                </p>
              </div>
              <span className="status-badge status-warning">ต้องติดตามต่อเนื่อง</span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                { title: "นัดครั้งล่าสุด", value: formatThaiDate(stats.lastAppointment), note: "ขาดนัดและต้องโทรติดตามในวันเดียวกัน" },
                { title: "นัดครั้งถัดไป", value: formatThaiDate(stats.nextAppointment), note: "วางแผนประเมินอาการและ adherence" },
                { title: "Barrier หลัก", value: "การเดินทาง + ลืมนัด", note: "มีผู้ดูแลช่วยประสานได้" },
                { title: "Caregiver", value: "บุตรสาว / โทร 089-111-xxxx", note: "ติดต่อได้ในช่วงเช้า" }
              ].map((item) => (
                <div key={item.title} className="rounded-[24px] bg-[var(--surface-strong)] px-4 py-4" style={{ border: "1px solid var(--line)" }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-muted)" }}>
                    {item.title}
                  </p>
                  <p className="mt-3 text-xl font-semibold tracking-[-0.02em]">{item.value}</p>
                  <p className="mt-2 text-sm leading-7" style={{ color: "var(--ink-muted)" }}>{item.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {adherenceWidgets.map((item) => (
                <div key={item.title} className="rounded-[24px] bg-[var(--page-bg-soft)] px-4 py-4">
                  <span className={`status-badge ${item.tone}`}>{item.title}</span>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.02em]">{item.value}</p>
                  <p className="mt-2 text-sm leading-7" style={{ color: "var(--ink-muted)" }}>{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card px-6 py-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">Timeline การรักษาและติดตาม</h3>
                <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
                  เห็นภาพว่าทีมเคยทำอะไรไปแล้วและ intervention แบบใดได้ผล
                </p>
              </div>
              <span className="status-badge status-brand">{timeline.length} รายการล่าสุด</span>
            </div>

            <div className="mt-5 space-y-3">
              {timeline.map((entry) => (
                <div key={entry.id} className="rounded-[24px] bg-[var(--surface-strong)] px-4 py-4" style={{ border: "1px solid var(--line)" }}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className={`status-badge ${timelineTone(entry.type)}`}>{entry.type}</span>
                      <p className="mt-3 text-base font-semibold">
                        {entry.clinicName ?? "คลินิกจิตเวช"} • {entry.doctorName ?? "ทีมรักษา"}
                      </p>
                    </div>
                    <p className="text-sm font-medium" style={{ color: "var(--ink-muted)" }}>
                      {formatThaiDate(entry.entryDate)}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-7">{entry.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
