"use client"

import { useState } from "react"
import Link from "next/link"

const MISSED_APPOINTMENTS = [
  { id: "1", date: "25 มี.ค. 2569", doctor: "นพ.วิชัย สมบูรณ์", reason: "ติดธุระด่วน", followUp: "PHONE", status: "RESCHEDULED" },
  { id: "2", date: "10 มี.ค. 2569", doctor: "นพ.วิชัย สมบูรณ์", reason: "ลืมนัด", followUp: "SMS", status: "NOT_YET" },
  { id: "3", date: "20 ก.พ. 2569", doctor: "พญ.อรัญญา ใจดี", reason: "ป่วยกะทันหัน", followUp: "PHONE", status: "RESCHEDULED" },
]

export function PatientAppointmentHistoryPage() {
  const [reminders, setReminders] = useState({ oneDay: true, twoHours: true, thirtyMins: false })
  const [channels, setChannels] = useState({ push: true, sms: false, line: true })

  return (
    <div className="mx-auto w-full max-w-[390px] min-h-screen pb-32 overflow-x-hidden" style={{ background: "#0d0f1a" }}>
      
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 flex items-center gap-4 px-5 pt-12 pb-4" style={{ background: "rgba(13,15,26,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <Link href="/dashboard" className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(167,139,250,0.2)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </Link>
        <h1 className="text-[18px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>ประวัติการนัดหมาย</h1>
      </header>

      <main className="px-5 mt-6 flex flex-col gap-6">
        
        {/* ── Summary Card ── */}
        <section className="rounded-3xl p-6 animate-fade-in" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.15)", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
          <h3 className="text-[11px] font-bold text-[#2dd4bf] tracking-widest uppercase mb-6 font-mono">// สถิติการนัดหมาย</h3>
          
          <div className="flex items-center justify-between gap-4">
             <div className="flex flex-col gap-5 flex-1">
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-full bg-[#10b981]/15 flex items-center justify-center text-[#10b981]">✅</div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#64748b]">มาตามนัด</span>
                      <span className="text-xl font-bold text-white font-mono leading-none">8</span>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-full bg-[#f43f5e]/15 flex items-center justify-center text-[#f43f5e]">❌</div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#64748b]">ขาดนัด</span>
                      <span className="text-xl font-bold text-white font-mono leading-none">3</span>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-full bg-[#a78bfa]/15 flex items-center justify-center text-[#a78bfa]">📅</div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#64748b]">ทั้งหมด</span>
                      <span className="text-xl font-bold text-white font-mono leading-none">11</span>
                   </div>
                </div>
             </div>

             <div className="relative h-32 w-32 flex items-center justify-center">
                <svg className="h-full w-full transform -rotate-90">
                   <circle cx="64" cy="64" r="56" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                   <circle cx="64" cy="64" r="56" fill="transparent" stroke="#a78bfa" strokeWidth="12" strokeDasharray={351.8} strokeDashoffset={351.8 * (1 - 0.72)} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute flex flex-col items-center">
                   <span className="text-2xl font-bold text-white font-mono">72%</span>
                   <span className="text-[8px] font-bold text-[#a78bfa] uppercase tracking-widest leading-none">เข้าตรวจ</span>
                </div>
             </div>
          </div>
        </section>

        {/* ── Missed Appointments List ── */}
        <section className="flex flex-col gap-4 animate-slide-up" style={{ animationDelay: "150ms" }}>
           <h3 className="text-[13px] font-bold text-[#94a3b8] px-2 mb-1 flex justify-between items-center">
              รายการขาดนัดที่ผ่านมา
              <span className="text-[10px] font-mono text-[#475569]">3 รายการ</span>
           </h3>
           
           {MISSED_APPOINTMENTS.map((item, i) => (
             <div 
               key={item.id}
               className="rounded-2xl p-4 flex flex-col gap-3 transition-all duration-300"
               style={{
                 background: "rgba(255,255,255,0.03)",
                 border: "1px solid rgba(167,139,250,0.1)",
                 borderLeft: "4px solid #f43f5e",
                 animationDelay: `${i * 100}ms`
               }}
             >
                <div className="flex items-start justify-between">
                   <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">{item.date}</span>
                      <span className="text-[11px] text-[#94a3b8] mt-0.5">{item.doctor}</span>
                   </div>
                   {item.status === "RESCHEDULED" ? (
                     <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/20">นัดใหม่แล้ว</span>
                   ) : (
                     <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/20">ยังไม่ได้นัด</span>
                   )}
                </div>

                <div className="flex items-center gap-2">
                   <div className="flex-1 rounded-lg px-3 py-2 flex items-center justify-between bg-white/3 border border-white/5">
                      <span className="text-[10px] text-[#64748b]">เหตุผล:</span>
                      <span className="text-[11px] font-bold text-[#fb923c]">{item.reason}</span>
                   </div>
                   <div className="flex gap-1.5">
                      {item.followUp === "PHONE" ? (
                        <div className="h-7 w-7 rounded-lg bg-[#2dd4bf]/15 flex items-center justify-center text-[#2dd4bf]">📞</div>
                      ) : (
                        <div className="h-7 w-7 rounded-lg bg-[#94a3b8]/15 flex items-center justify-center text-[#94a3b8]">💬</div>
                      )}
                   </div>
                </div>
             </div>
           ))}
        </section>

        {/* ── Reminder Settings Card ── */}
        <section className="rounded-3xl p-6 animate-slide-up" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.15)", animationDelay: "300ms" }}>
           <h3 className="text-sm font-bold text-white mb-6 pl-1 tracking-wide">ตั้งค่าการแจ้งเตือน</h3>
           
           <div className="flex flex-col gap-6">
              {/* Toggles */}
              <div className="flex flex-col gap-4">
                 {[
                   { id: "oneDay", label: "แจ้งก่อน 1 วัน", active: reminders.oneDay },
                   { id: "twoHours", label: "แจ้งก่อน 2 ชั่วโมง", active: reminders.twoHours },
                   { id: "thirtyMins", label: "แจ้งก่อน 30 นาที", active: reminders.thirtyMins }
                 ].map(item => (
                   <div key={item.id} className="flex items-center justify-between px-1">
                      <span className="text-[13px] text-[#f1f5f9] font-medium">{item.label}</span>
                      <div 
                        onClick={() => setReminders({...reminders, [item.id]: !item.active})}
                        className={`w-9 h-5 rounded-full relative p-1 transition-all duration-300 cursor-pointer ${item.active ? "bg-[#a78bfa]" : "bg-[#475569]"}`}
                      >
                         <div className={`h-3 w-3 bg-white rounded-full transition-transform duration-300 ${item.active ? "translate-x-4" : "translate-x-0"}`} />
                      </div>
                   </div>
                 ))}
              </div>

              {/* Channels */}
              <div className="flex gap-2 p-1 rounded-2xl bg-white/3 border border-white/5">
                 {[
                   { id: "push", label: "PUSH", icon: "🔔" },
                   { id: "sms", label: "SMS", icon: "📱" },
                   { id: "line", label: "LINE", icon: "🟢" }
                 ].map(item => (
                   <button 
                     key={item.id}
                     onClick={() => setChannels({...channels, [item.id as keyof typeof channels]: !channels[item.id as keyof typeof channels]})}
                     className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-300 border ${channels[item.id as keyof typeof channels] ? "bg-[#a78bfa]/15 border-[#a78bfa]/40 text-white" : "bg-transparent border-transparent text-[#475569]"}`}
                   >
                      <span className="text-base">{item.icon}</span>
                      <span className="text-[9px] font-bold tracking-widest">{item.label}</span>
                   </button>
                 ))}
              </div>

              {/* Emergency Contact */}
              <div className="mt-2 p-4 rounded-2xl flex items-center gap-4" style={{ background: "rgba(167,139,250,0.05)", border: "1px dashed rgba(167,139,250,0.3)" }}>
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#a78bfa]/20 text-[#a78bfa]">🆘</div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-[#a78bfa] uppercase tracking-widest">ผู้ติดต่อขณะจำเป็น</span>
                     <span className="text-[13px] font-bold text-white mt-0.5">คุณมะลิ (มารดา) · 089-xxx-xxxx</span>
                  </div>
              </div>
           </div>
        </section>

      </main>

      {/* ── Bottom CTA ── */}
      <div 
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-5 py-8 z-50 rounded-t-3xl"
        style={{
          background: "linear-gradient(to top, rgba(13,15,26,1) 80%, transparent 100%)",
          backdropFilter: "blur(10px)"
        }}
      >
        <button
          className="w-full rounded-2xl py-4 text-[15px] font-bold text-white transition-all active:scale-95 shadow-lg group hover:shadow-[#a78bfa]/20"
          style={{
            background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
            boxShadow: "0 8px 32px rgba(124,58,237,0.4)"
          }}
        >
          นัดหมายใหม่
        </button>
      </div>

    </div>
  )
}
