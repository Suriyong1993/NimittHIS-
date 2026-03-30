"use client"

import { useState } from "react"
import Link from "next/link"

interface NoShowPatient {
  id: string
  name: string
  hn: string
  diagnosis: string
  risk: "HIGH" | "MEDIUM"
  time: string
  noShowCount: number
  avatar: string
}

const NOSHOW_PATIENTS: NoShowPatient[] = [
  { id: "1", name: "นายสมชาย วีระกุล", hn: "HN00142", diagnosis: "โรคซึมเศร้า", risk: "HIGH", time: "09:00 น.", noShowCount: 3, avatar: "https://i.pravatar.cc/150?u=noshow1" },
  { id: "2", name: "นางสาวมณี ใจดี", hn: "HN00155", diagnosis: "โรควิตกกังวล", risk: "MEDIUM", time: "10:30 น.", noShowCount: 1, avatar: "https://i.pravatar.cc/150?u=noshow2" },
  { id: "3", name: "นายวิชัย สุขสบาย", hn: "HN00168", diagnosis: "PTSD", risk: "HIGH", time: "11:15 น.", noShowCount: 2, avatar: "https://i.pravatar.cc/150?u=noshow3" },
]

export function NoShowManagementPage() {
  const [selectedPatient, setSelectedPatient] = useState<NoShowPatient | null>(null)
  const [showBottomSheet, setShowBottomSheet] = useState(false)

  const handlePatientClick = (p: NoShowPatient) => {
    setSelectedPatient(p)
    setShowBottomSheet(true)
  }

  return (
    <div className="mx-auto w-full max-w-[390px] min-h-screen pb-20 overflow-x-hidden" style={{ background: "#0d0f1a" }}>
      
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 pt-12 pb-4" style={{ background: "rgba(13,15,26,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(167,139,250,0.2)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </Link>
          <h1 className="text-[18px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>แจ้งเตือนขาดนัด</h1>
        </div>
        <div className="relative">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#f43f5e] flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#0d0f1a]">3</div>
        </div>
      </header>

      <main className="px-5 mt-6 flex flex-col gap-5">
        
        {/* ── Alert Banner ── */}
        <section className="relative overflow-hidden rounded-2xl p-5 animate-fade-in" style={{ background: "rgba(244,63,94,0.05)", borderLeft: "4px solid #f43f5e", border: "1px solid rgba(244,63,94,0.15)", borderLeftWidth: "4px" }}>
          <div className="absolute top-0 right-0 h-full w-32 opacity-10 bg-gradient-to-l from-[#f43f5e] to-transparent" />
          <div className="relative flex items-center gap-4">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#f43f5e]/20 text-[#f43f5e]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">ผู้ป่วยไม่มาตามนัด 3 ราย</span>
              <span className="text-[10px] font-bold text-[#64748b] font-mono tracking-widest mt-0.5 uppercase">วันนี้ 09:00 — 12:00 น.</span>
            </div>
          </div>
        </section>

        {/* ── No-Show List ── */}
        <section className="flex flex-col gap-4 animate-slide-up">
          {NOSHOW_PATIENTS.map((p, i) => (
            <div 
              key={p.id}
              onClick={() => handlePatientClick(p)}
              className="group relative flex flex-col gap-4 rounded-[28px] p-5 transition-all duration-300 active:scale-98"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(167,139,250,0.12)",
                borderLeft: `4px solid ${p.risk === "HIGH" ? "#f43f5e" : "#fb923c"}`,
                animationDelay: `${i * 100}ms`
              }}
            >
              {/* Top Row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img src={p.avatar} alt={p.name} className="h-11 w-11 rounded-full border-2 border-white/5" />
                  <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-white">{p.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono font-bold text-[#2dd4bf] uppercase tracking-tighter">{p.hn}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#a78bfa]/10 text-[#a78bfa] border border-[#a78bfa]/20">{p.diagnosis}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${p.risk === "HIGH" ? "bg-[#f43f5e]/15 text-[#f43f5e]" : "bg-[#fb923c]/15 text-[#fb923c]"}`}>
                   {p.risk === "HIGH" ? "เสี่ยงสูง" : "เสี่ยงกลาง"}
                </span>
              </div>

              {/* Middle Row */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[#64748b]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span className="text-xs font-mono line-through opacity-40">นัด {p.time}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/20">ขาดนัด</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#fb923c]">
                  <span className="text-[10px] font-bold uppercase tracking-widest animate-pulse">ขาดนัดครั้งที่ {p.noShowCount}</span>
                </div>
              </div>

              {/* Action Row */}
              <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-white/5">
                <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-bold text-[#2dd4bf] bg-[#2dd4bf]/5 border border-[#2dd4bf]/20">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  โทรหา
                </button>
                <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-bold text-[#a78bfa] bg-[#a78bfa]/5 border border-[#a78bfa]/20">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  ส่ง SMS
                </button>
                <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-bold text-[#94a3b8] bg-white/5 border border-white/10">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  นัดใหม่
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* ── Follow-up Bottom Sheet ── */}
      {showBottomSheet && selectedPatient && (
        <>
          <div 
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-fade-in" 
            onClick={() => setShowBottomSheet(false)}
          />
          <div 
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-[70] p-6 rounded-t-[40px] animate-slide-up"
            style={{ 
              background: "#111827", 
              borderTop: "1px solid rgba(167,139,250,0.3)",
              boxShadow: "0 -20px 50px rgba(0,0,0,0.8)"
            }}
          >
            {/* Header Handle */}
            <div className="mx-auto w-12 h-1.5 rounded-full bg-white/10 mb-6" />
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">ดำเนินการติดตาม</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[#94a3b8]">{selectedPatient.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${selectedPatient.risk === "HIGH" ? "bg-[#f43f5e]/15 text-[#f43f5e]" : "bg-[#fb923c]/15 text-[#fb923c]"}`}>
                      {selectedPatient.risk} RISK
                    </span>
                  </div>
                </div>
                <button onClick={() => setShowBottomSheet(false)} className="text-[#64748b]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-hide">
                {[
                  { icon: "📞", title: "โทรหาผู้ป่วยทันที", sub: "ระบบจะบันทึกการโทรลงใน Timeline อัตโนมัติ", color: "#2dd4bf" },
                  { icon: "💬", title: "ส่ง SMS แจ้งเตือน", sub: "เลือกจากเทมเพลตมาตรฐานของโรงพยาบาล", color: "#a78bfa" },
                  { icon: "👨‍👩‍👧", title: "ติดต่อผู้ดูแล / ญาติ", sub: "คุณแม่วิมล: 081-xxx-xxxx", color: "#60a5fa" },
                  { icon: "📅", title: "ทำนัดหมายใหม่เสนอผู้ป่วย", sub: "หาคิวว่างถัดไปของ นพ.วิชัย", color: "#fbbf24" },
                  { icon: "📝", title: "บันทึกเหตุผลการขาดนัด", sub: "เลือกเหตุผล: ลืม/ป่วย/ติดธุระ/ฯลฯ", color: "#94a3b8" },
                  { icon: "🚨", title: "แจ้งเหตุฉุกเฉิน (High Risk)", sub: "เคสเสี่ยงสูงพิเศษ ต้องการความช่วยเหลือด่วน", color: "#f43f5e", isEmergency: true },
                ].map((action, idx) => (
                  <button 
                    key={idx}
                    className={`flex items-start gap-4 p-4 rounded-2xl transition-all active:scale-95 text-left ${action.isEmergency ? "bg-[#f43f5e]/10 border border-[#f43f5e]/30 shadow-[0_4px_15px_rgba(244,63,94,0.15)]" : "bg-white/5 border border-white/5 hover:border-white/10"}`}
                  >
                    <span className="text-xl">{action.icon}</span>
                    <div className="flex flex-col">
                      <span className={`text-[14px] font-bold ${action.isEmergency ? "text-[#f43f5e]" : "text-white"}`}>{action.title}</span>
                      <span className="text-[11px] text-[#64748b] leading-relaxed mt-0.5">{action.sub}</span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-bold text-white transition-all active:scale-95 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
                  boxShadow: "0 8px 32px rgba(124,58,237,0.4)"
                }}
              >
                บันทึกการดำเนินการ
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
    </div>
  )
}
