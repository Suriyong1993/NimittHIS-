"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { getPatients } from "../api/patients"
import { getOverdueAppointments } from "../api/appointments"

type Tab = "high-risk" | "overdue"

const RISK_MAP: Record<string, { label: string; tone: string; bar: string; color: string }> = {
  LOW: { label: "ต่ำ", tone: "teal", bar: "bg-teal-500", color: "text-teal-400" },
  MEDIUM: { label: "ปานกลาง", tone: "orange", bar: "bg-orange-500", color: "text-orange-400" },
  HIGH: { label: "สูง", tone: "rose", bar: "bg-rose-500", color: "text-rose-400" }
}

function RiskScoreBar({ score }: { score: number }) {
  const capped = Math.min(100, Math.max(0, score))
  const config = capped >= 70 ? RISK_MAP.HIGH : capped >= 40 ? RISK_MAP.MEDIUM : RISK_MAP.LOW
  
  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${config.bar}`}
          style={{ width: `${capped}%`, boxShadow: `0 0 8px var(--color-primary)` }}
        />
      </div>
      <span className="font-mono text-[10px] font-bold text-muted">{capped.toFixed(0)}%</span>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 border-b border-white/5 py-5 animate-pulse">
      <div className="h-12 w-12 rounded-2xl bg-white/5" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-32 rounded-full bg-white/5" />
        <div className="h-2 w-20 rounded-full bg-white/5" />
      </div>
      <div className="h-8 w-24 rounded-xl bg-white/5" />
    </div>
  )
}

export function NoShowTrackingPage() {
  const [tab, setTab] = useState<Tab>("high-risk")

  const { data: riskQueryData, isLoading: isRiskLoading } = useQuery({
    queryKey: ["patients", "high-risk-all"],
    queryFn: () => getPatients({ riskLevel: "HIGH", limit: 20 }),
    staleTime: 60_000
  })

  const { data: overdueQueryData, isLoading: isOverdueLoading } = useQuery({
    queryKey: ["appointments", "overdue"],
    queryFn: getOverdueAppointments,
    staleTime: 60_000
  })

  const riskItems = useMemo(() => (riskQueryData as any)?.data ?? [], [riskQueryData])
  const overdueItems = useMemo(() => (overdueQueryData as any) ?? [], [overdueQueryData])

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 space-y-10">
      
      {/* Header */}
      <div className="animate-entrance">
        <h1 className="text-4xl font-bold tracking-tight">ระบบติดตามการขาดนัด</h1>
        <p className="mt-2 text-muted text-sm max-w-lg">เฝ้าระวังและบริหารจัดการผู้ป่วยที่มีความเสี่ยงสูงในการขาดนัด เพื่อเพิ่มประสิทธิภาพการรักษา</p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-entrance [animation-delay:100ms]">
        {[
          { label: "ความเสี่ยงสูง", value: isRiskLoading ? "—" : riskItems.length, sub: "ผู้ป่วยเฝ้าระวังปัจจุบัน", color: "text-rose-400", bg: "bg-rose-500/10", icon: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></> },
          { label: "เกินกำหนดนัด", value: isOverdueLoading ? "—" : overdueItems.length, sub: "นัดหมายที่ขาดไปแล้ว", color: "text-orange-400", bg: "bg-orange-500/10", icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
          { label: "อัตราสำเร็จ", value: "84%", sub: "การติดตามผลเฉลี่ย", color: "text-teal-400", bg: "bg-teal-500/10", icon: <path d="M20 6L9 17l-5-5"/> }
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-[32px] flex items-center gap-5 border-white/5">
            <div className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">{stat.icon}</svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-bold tracking-tight mt-0.5">{stat.value}</p>
              <p className="text-[10px] text-subtle mt-1 font-medium">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main List Area */}
      <div className="glass rounded-[40px] overflow-hidden border-white/5 animate-entrance [animation-delay:200ms]">
        
        {/* Advanced Tab Bar */}
        <div className="flex px-10 pt-8 border-b border-white/5">
          {(["high-risk", "overdue"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative mr-10 pb-4 text-sm font-bold transition-all ${
                tab === t ? "text-white" : "text-subtle hover:text-muted"
              }`}
            >
              {t === "high-risk" ? "ผู้ป่วยกลุ่มเสี่ยงสูง" : "นัดหมายเกินกำหนด"}
              {tab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)]" />
              )}
            </button>
          ))}
        </div>

        <div className="p-8">
          {tab === "high-risk" ? (
            <div className="space-y-1">
              {isRiskLoading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : riskItems.length === 0 ? (
                <EmptyState icon={<path d="M20 6L9 17l-5-5"/>} text="ไม่มีผู้ป่วยเสี่ยงสูงในขณะนี้" />
              ) : (
                riskItems.map((p: any, i: number) => {
                  const risk = RISK_MAP[p.riskLevel] ?? RISK_MAP.MEDIUM
                  return (
                    <div
                      key={p.id}
                      className="group flex flex-wrap md:flex-nowrap items-center gap-6 p-5 rounded-3xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5 animate-entrance stagger-delay"
                      style={{ "--stagger": i } as any}
                    >
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-violet-600/20 text-primary flex items-center justify-center text-xl font-bold border border-primary/20">
                        {p.firstName?.charAt(0) ?? "?"}
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <h4 className="font-bold text-lg leading-tight">{p.firstName} {p.lastName}</h4>
                        <div className="flex items-center gap-3 mt-1.5 font-bold text-[10px] text-muted uppercase tracking-wider">
                          <span>HN {p.hn ?? "—"}</span>
                          <span className="h-1 w-1 rounded-full bg-white/20" />
                          <span>TEL {p.phone ?? "—"}</span>
                        </div>
                      </div>
                      <div className="hidden lg:block w-40">
                        <p className="text-[10px] font-bold text-muted uppercase mb-2">No-Show Score</p>
                        <RiskScoreBar score={p.noShowScore ?? 0} />
                      </div>
                      <div className="text-right px-4">
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Missed</p>
                        <p className="text-xl font-bold text-rose-400 leading-none">{p.totalNoShows ?? 0}</p>
                      </div>
                      <div className={`pill h-9 px-5 flex items-center justify-center font-bold text-[10px] uppercase tracking-widest ${risk.color} bg-white/5 border-white/5`}>
                        {risk.label}
                      </div>
                      <button className="h-12 w-12 rounded-2xl glass-light border-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all tap-active">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {isOverdueLoading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
              ) : overdueItems.length === 0 ? (
                <EmptyState icon={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>} text="ไม่มีนัดหมายเกินกำหนด" />
              ) : (
                overdueItems.map((appt: any, i: number) => {
                  const date = appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) : "—"
                  return (
                    <div
                      key={appt.id}
                      className="group flex items-center gap-6 p-5 rounded-3xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5 animate-entrance stagger-delay"
                      style={{ "--stagger": i } as any}
                    >
                      <div className="h-14 w-14 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg leading-tight">{appt.patient?.firstName} {appt.patient?.lastName}</h4>
                        <div className="flex items-center gap-3 mt-1.5 font-bold text-[10px] text-muted uppercase tracking-wider">
                          <span>นัดเมื่อ {date}</span>
                          <span className="h-1 w-1 rounded-full bg-white/20" />
                          <span>{appt.timeFrom?.slice(0, 5)} น.</span>
                        </div>
                      </div>
                      <div className="text-right px-4 hidden sm:block">
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Clinic</p>
                        <p className="text-sm font-bold text-white">{appt.clinic?.name ?? "—"}</p>
                      </div>
                      <div className="pill h-9 px-5 flex items-center justify-center font-bold text-[10px] uppercase tracking-widest text-orange-400 bg-orange-500/5 border-orange-500/20">
                        เกินกำหนด
                      </div>
                      <button className="h-12 w-12 rounded-2xl glass-light border-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all tap-active">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex flex-col items-center gap-5 py-24 text-center opacity-60">
      <div className="h-20 w-20 rounded-[32px] bg-white/5 flex items-center justify-center text-muted">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">{icon}</svg>
      </div>
      <p className="text-sm font-bold text-muted tracking-tight">{text}</p>
    </div>
  )
}
