"use client"

import Link from "next/link"
import { useState } from "react"

interface PatientProfilePageProps {
  patientId: string
}

export function PatientProfilePage({ patientId }: PatientProfilePageProps) {
  const [activeTab, setActiveTab] = useState<"ข้อมูลทั่วไป" | "ประวัติการรักษา" | "อารมณ์" | "นัดหมาย">("อารมณ์")

  const TABS = ["ข้อมูลทั่วไป", "ประวัติการรักษา", "อารมณ์", "นัดหมาย"] as const

  const MOOD_DATA = [
    { day: "จ.", mood: "😔", color: "#f97316", y: 70 },
    { day: "อ.", mood: "😐", color: "#60a5fa", y: 50 },
    { day: "พ.", mood: "😐", color: "#60a5fa", y: 50 },
    { day: "พฤ.", mood: "🙂", color: "#34d399", y: 30 },
    { day: "ศ.", mood: "😔", color: "#f97316", y: 70 },
    { day: "ส.", mood: "😢", color: "#f43f5e", y: 90 },
    { day: "อา.", mood: "😐", color: "#60a5fa", y: 50 },
  ]

  return (
    <div className="mx-auto w-full max-w-[390px] min-h-screen pb-32" style={{ background: "#0d0f1a" }}>
      
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 pt-12 pb-4" style={{ background: "rgba(13,15,26,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <Link href="/dashboard" className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(167,139,250,0.2)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </Link>
        <h1 className="text-[17px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>โปรไฟล์ผู้ป่วย</h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(167,139,250,0.2)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
        </button>
      </header>

      <main className="flex flex-col gap-6 px-5 mt-4">
        
        {/* ── Hero Card ── */}
        <section className="relative flex flex-col items-center rounded-3xl p-6 text-center animate-slide-up" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(167,139,250,0.15)", boxShadow: "0 24px 64px rgba(13,15,26,0.5)" }}>
          {/* Background glow blob */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)" }} />
          
          <div className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-full text-4xl font-bold" style={{ background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)", color: "#fff", boxShadow: "0 0 30px rgba(167,139,250,0.4)" }}>
            ส
          </div>
          
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>นายสมชาย ใจดี</h2>
          <p className="mt-1 font-mono text-[13px] text-[#2dd4bf] font-medium tracking-wide">HN 0014285</p>

          {/* Pill stats row */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="rounded-full px-3 py-1 text-[11px] font-medium text-[#f1f5f9]" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>อายุ 35 ปี</span>
            <span className="rounded-full px-3 py-1 text-[11px] font-medium text-[#f1f5f9]" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>เพศชาย</span>
            <span className="rounded-full px-3 py-1 text-[11px] font-medium text-[#f1f5f9]" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>กรุ๊ป B+</span>
          </div>

          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold" style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)", boxShadow: "0 0 20px rgba(167,139,250,0.2)" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#a78bfa]"></span>
              โรคซึมเศร้า (MDD)
            </span>
          </div>
        </section>

        {/* ── Tabs Row ── */}
        <div className="flex w-full overflow-x-auto pb-2 scrollbar-hide animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-bold transition-all"
                style={{
                  background: activeTab === tab ? "linear-gradient(135deg, rgba(167,139,250,0.2) 0%, rgba(124,58,237,0.2) 100%)" : "transparent",
                  color: activeTab === tab ? "#f1f5f9" : "#64748b",
                  border: `1px solid ${activeTab === tab ? "rgba(167,139,250,0.4)" : "transparent"}`
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content Area (อารมณ์ Tab) ── */}
        {activeTab === "อารมณ์" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            
            {/* Mood History Chart */}
            <section className="rounded-3xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.1)" }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[15px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>ประวัติอารมณ์ 7 วันย้อนหลัง</h3>
                <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ background: "rgba(96,165,250,0.15)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.3)" }}>
                  เฉลี่ย: ปานกลาง
                </span>
              </div>

              <div className="relative h-[120px] w-full mt-4">
                {/* Chart connecting line (SVG) */}
                <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                  <path
                    d={`M ${100/14}% ${MOOD_DATA[0].y}% ` + MOOD_DATA.slice(1).map((d, i) => `L ${(100/7)*(i+1) + (100/14)}% ${d.y}%`).join(" ")}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="rgba(167,139,250,0.2)" />
                      <stop offset="50%" stopColor="rgba(167,139,250,0.8)" />
                      <stop offset="100%" stopColor="rgba(167,139,250,0.2)" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Data Points */}
                <div className="absolute inset-0 flex justify-between items-center px-2">
                  {MOOD_DATA.map((data, i) => (
                    <div key={i} className="flex flex-col items-center absolute -translate-x-1/2" style={{ left: `${(100/7)*i + (100/14)}%`, top: `calc(${data.y}% - 14px)` }}>
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full text-xs shadow-lg relative z-10"
                        style={{ background: "#0d0f1a", border: `1.5px solid ${data.color}`, boxShadow: `0 0 12px ${data.color}40` }}
                      >
                        {data.mood}
                      </div>
                      <span className="mt-8 text-[10px] text-[#64748b] font-medium absolute top-full">{data.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Risk Assessment */}
            <section className="rounded-3xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.1)" }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[15px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>ประเมินความเสี่ยง</h3>
                <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ background: "rgba(251,146,60,0.15)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.3)" }}>
                  ความเสี่ยงปานกลาง
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {/* PHQ-9 */}
                <div>
                  <div className="flex items-end justify-between mb-1.5">
                    <p className="text-[13px] font-semibold text-[#f1f5f9]">PHQ-9 (ซึมเศร้า)</p>
                    <p className="font-mono text-xs"><span className="text-[16px] text-[#f43f5e] font-bold">12</span> <span className="text-[#64748b]">/27</span></p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full w-[44%]" style={{ background: "linear-gradient(90deg, #a78bfa, #f43f5e)", boxShadow: "0 0 10px rgba(244,63,94,0.4)" }} />
                  </div>
                </div>

                {/* GAD-7 */}
                <div>
                  <div className="flex items-end justify-between mb-1.5">
                    <p className="text-[13px] font-semibold text-[#f1f5f9]">GAD-7 (วิตกกังวล)</p>
                    <p className="font-mono text-xs"><span className="text-[16px] text-[#fb923c] font-bold">8</span> <span className="text-[#64748b]">/21</span></p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full w-[38%]" style={{ background: "linear-gradient(90deg, #a78bfa, #fb923c)", boxShadow: "0 0 10px rgba(251,146,60,0.4)" }} />
                  </div>
                </div>
              </div>
            </section>

            {/* Medication */}
            <section>
              <h3 className="text-[15px] font-bold text-white tracking-wide mb-3 pl-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>ยาที่ได้รับ</h3>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between rounded-xl p-3.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"></line></svg>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#f1f5f9]">ฟลูออกซิทีน (Fluoxetine)</p>
                      <p className="text-[11px] font-mono text-[#94a3b8] mt-0.5">20 mg แคปซูล</p>
                    </div>
                  </div>
                  <span className="rounded-md px-2 py-1 text-[10px] font-bold" style={{ background: "rgba(45,212,191,0.15)", color: "#2dd4bf" }}>วันละ 1 ครั้ง (เช้า)</span>
                </div>

                <div className="flex items-center justify-between rounded-xl p-3.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="2" x2="12" y2="22"></line></svg>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#f1f5f9]">ลอราซีแพม (Lorazepam)</p>
                      <p className="text-[11px] font-mono text-[#94a3b8] mt-0.5">0.5 mg เม็ด</p>
                    </div>
                  </div>
                  <span className="rounded-md px-2 py-1 text-[10px] font-bold" style={{ background: "rgba(251,146,60,0.15)", color: "#fb923c" }}>เวลานอน (เมื่อจำเป็น)</span>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* ── Bottom Sticky Buttons ── */}
      <div 
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-5 py-6 flex flex-col gap-3 z-50 rounded-t-3xl"
        style={{
          background: "linear-gradient(to top, rgba(13,15,26,0.95) 60%, transparent 100%)",
          backdropFilter: "blur(10px)"
        }}
      >
        <button
          className="w-full rounded-2xl py-3.5 text-sm font-bold text-white transition-all active:scale-95 shadow-lg"
          style={{
            background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
            boxShadow: "0 8px 24px rgba(124,58,237,0.4)"
          }}
        >
          บันทึกการพบ (Follow up)
        </button>
        <button
          className="w-full rounded-2xl py-3.5 text-sm font-bold transition-all active:scale-95"
          style={{
            background: "rgba(45,212,191,0.05)",
            border: "1px solid rgba(45,212,191,0.4)",
            color: "#2dd4bf"
          }}
        >
          นัดหมายถัดไป
        </button>
      </div>

      {/* Scrollbar hide utility */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
