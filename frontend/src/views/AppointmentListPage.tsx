"use client"

import { useState } from "react"
import Link from "next/link"

const PAST_SESSIONS = [
  { id: 1, date: "15 มี.ค. 2569", doctor: "นพ.วิชัย สมบูรณ์", type: "ปรึกษาออนไลน์", duration: "50 นาที", moodBefore: "😢", moodAfter: "😐", moodBeforeColor: "#f43f5e", moodAfterColor: "#60a5fa" },
  { id: 2, date: "1 มี.ค. 2569", doctor: "พญ.อรัญญา ใจดี", type: "ห้องตรวจ", duration: "50 นาที", moodBefore: "😔", moodAfter: "😊", moodBeforeColor: "#f97316", moodAfterColor: "#fbbf24" },
  { id: 3, date: "14 ก.พ. 2569", doctor: "นพ.วิชัย สมบูรณ์", type: "ปรึกษาออนไลน์", duration: "50 นาที", moodBefore: "😐", moodAfter: "🙂", moodBeforeColor: "#60a5fa", moodAfterColor: "#34d399" },
]

const MOOD_TREND = [
  { day: "จ.", mood: "😔", color: "#f97316", y: 70 },
  { day: "อ.", mood: "😐", color: "#60a5fa", y: 50 },
  { day: "พ.", mood: "😐", color: "#60a5fa", y: 50 },
  { day: "พฤ.", mood: "🙂", color: "#34d399", y: 30 },
  { day: "ศ.", mood: "😊", color: "#fbbf24", y: 10 },
  { day: "ส.", mood: "🙂", color: "#34d399", y: 30 },
  { day: "อา.", mood: "😊", color: "#fbbf24", y: 10 },
]

export function AppointmentListPage() {
  const [activeTab, setActiveTab] = useState<"กำลังจะมาถึง" | "ผ่านมาแล้ว" | "ยกเลิก">("กำลังจะมาถึง")
  const TABS = ["กำลังจะมาถึง", "ผ่านมาแล้ว", "ยกเลิก"] as const

  return (
    <div className="mx-auto w-full max-w-[390px] min-h-screen pb-32" style={{ background: "#0d0f1a" }}>
      
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 pt-12 pb-4" style={{ background: "rgba(13,15,26,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div className="w-10" /> {/* Spacer */}
        <h1 className="text-[17px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>นัดหมายของฉัน</h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(167,139,250,0.2)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
        </button>
      </header>

      {/* ── Tab Row ── */}
      <div className="flex w-full mt-2 border-b border-[#a78bfa]/10 px-5 animate-slide-up">
        {TABS.map((tab) => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative flex-1 pb-3 text-[14px] font-bold transition-all"
              style={{
                color: isActive ? "#f1f5f9" : "#64748b",
              }}
            >
              {tab}
              {isActive && (
                <div 
                  className="absolute bottom-[-1px] left-0 h-[2px] w-full rounded-t-sm" 
                  style={{ background: "#a78bfa", boxShadow: "0 -2px 10px rgba(167,139,250,0.5)" }} 
                />
              )}
            </button>
          )
        })}
      </div>

      <main className="flex flex-col gap-7 px-5 mt-6">
        
        {/* ── Upcoming Tab Content ── */}
        {activeTab === "กำลังจะมาถึง" && (
          <div className="animate-fade-in flex flex-col gap-6">
            
            {/* Next Appointment Hero Card */}
            <section className="relative overflow-hidden rounded-[24px] p-5" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(167,139,250,0.15)", boxShadow: "0 24px 64px rgba(13,15,26,0.5)" }}>
              {/* Shimmer gradient top border */}
              <div className="absolute top-0 left-0 w-full h-1" style={{ background: "linear-gradient(90deg, #a78bfa, #2dd4bf, #a78bfa)", backgroundSize: "200% auto", animation: "shimmerSlide 3s linear infinite" }} />
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-[#2dd4bf] tracking-widest uppercase font-mono bg-[#2dd4bf]/10 px-2.5 py-1 rounded-full border border-[#2dd4bf]/20">
                  นัดหมายถัดไป
                </span>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>พรุ่งนี้ <span className="font-mono text-[28px]">9:00</span> น.</h2>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="relative">
                  <img src="https://i.pravatar.cc/150?u=a042581f4e29026703d" alt="Doctor" className="h-[52px] w-[52px] rounded-full object-cover" />
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#10b981] ring-2 ring-[#0d0f1a]">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">นพ.วิชัย สมบูรณ์</h3>
                  <span className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)" }}>จิตแพทย์</span>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2.5 p-3.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-[#a78bfa]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                  <span className="text-[13px] font-medium text-[#f1f5f9]">พบแพทย์ที่ห้องตรวจ</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-[#2dd4bf]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <span className="text-[13px] font-medium text-[#f1f5f9]">อาคาร 2 ชั้น 4 ห้อง 412</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 rounded-2xl py-3.5 text-sm font-bold text-white shadow-lg transition-transform active:scale-95" style={{ background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)", boxShadow: "0 8px 24px rgba(124,58,237,0.3)" }}>
                  ยืนยันการมา
                </button>
                <button className="flex-1 rounded-2xl py-3.5 text-sm font-bold transition-transform active:scale-95" style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.3)", color: "#2dd4bf" }}>
                  โทรสอบถาม
                </button>
              </div>
            </section>

            {/* Past Sessions Min-list inside upcoming context just for UI richness if needed, but spec says past sessions list. I'll put it in Past tab. */}
          </div>
        )}

        {/* ── Past Sessions Content ── */}
        {(activeTab === "ผ่านมาแล้ว" || activeTab === "กำลังจะมาถึง") /* Showing past under Upcoming too for full rich preview per mock */ && (
          <div className={`animate-slide-up flex flex-col gap-6 ${activeTab === "กำลังจะมาถึง" ? "mt-2" : ""}`} style={{ animationDelay: "150ms" }}>
            
            <h3 className="text-[15px] font-bold text-white tracking-wide flex items-center gap-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>ประวัติการพบแพทย์ <span className="bg-[#10b981]/15 text-[#10b981] text-[10px] px-2 py-0.5 rounded-full border border-[#10b981]/20 font-bold ml-auto leading-none">ทั้งหมด 14 ครั้ง</span></h3>
            
            <div className="flex flex-col gap-3">
              {PAST_SESSIONS.map((session, i) => (
                <div key={session.id} className="relative rounded-2xl p-4 transition-transform active:scale-95" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.1)", animationDelay: `${200 + i * 50}ms` }}>
                  
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <img src="https://i.pravatar.cc/150?u=a042581f4e29026703d" alt="Doctor" className="h-10 w-10 rounded-[14px] object-cover" />
                      <div>
                        <span className="font-mono text-xs text-[#a78bfa]">{session.date}</span>
                        <h4 className="text-sm font-bold text-[#f1f5f9] mt-0.5">{session.doctor}</h4>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", color: "#94a3b8" }}>{session.type}</span>
                          <span className="font-mono text-[10px] text-[#64748b]">{session.duration}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>เสร็จสิ้น</span>
                  </div>

                  {/* Mood Change Row */}
                  <div className="mt-4 flex items-center justify-between rounded-xl px-3 py-2.5" style={{ background: "rgba(0,0,0,0.2)" }}>
                    <span className="text-[11px] text-[#94a3b8] font-medium">การเปลี่ยนแปลง:</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#64748b]">ก่อน</span>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full text-xs" style={{ background: `rgba(${hexToRgb(session.moodBeforeColor)}, 0.1)`, border: `1px solid ${session.moodBeforeColor}`, boxShadow: `0 0 10px ${session.moodBeforeColor}40` }}>{session.moodBefore}</div>
                      </div>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 6 20 12 13 18"></polyline><line x1="4" y1="12" x2="20" y2="12"></line></svg>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#64748b]">หลัง</span>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full text-xs" style={{ background: `rgba(${hexToRgb(session.moodAfterColor)}, 0.1)`, border: `1px solid ${session.moodAfterColor}`, boxShadow: `0 0 10px ${session.moodAfterColor}40` }}>{session.moodAfter}</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="mt-3 text-center text-[10px] text-[#2dd4bf] font-medium font-mono cursor-pointer">แตะเพื่อดูบันทึกประจำวัน ⤤</p>
                </div>
              ))}
            </div>

            {/* Mood Trend Mini Section */}
            <section className="mt-2 rounded-3xl p-5" style={{ background: "radial-gradient(circle at top left, rgba(167,139,250,0.08) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(167,139,250,0.15)", boxShadow: "0 10px 40px rgba(13,15,26,0.3)" }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[14px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>อารมณ์ 7 วันที่ผ่านมา</h3>
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#10b981] bg-[#10b981]/10 px-2.5 py-1 rounded-full border border-[#10b981]/20">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                  ดีขึ้น 23%
                </span>
              </div>

              <div className="relative h-[48px] w-full px-2">
                {/* SVG trend line */}
                <svg className="absolute inset-0 h-full w-full px-2" preserveAspectRatio="none">
                  <path
                    d={`M ${100/14}% ${MOOD_TREND[0].y}% ` + MOOD_TREND.slice(1).map((d, i) => `L ${(100/7)*(i+1) + (100/14)}% ${d.y}%`).join(" ")}
                    fill="none"
                    stroke="rgba(167,139,250,0.3)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(167,139,250,0.2)" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                  {/* Fill area */}
                  <path
                    d={`M ${100/14}% ${MOOD_TREND[0].y}% ` + MOOD_TREND.slice(1).map((d, i) => `L ${(100/7)*(i+1) + (100/14)}% ${d.y}%`).join(" ") + ` L ${95}% 100% L 5% 100% Z`}
                    fill="url(#trendGradient)"
                  />
                </svg>

                {/* Nodes */}
                <div className="absolute inset-0 flex justify-between items-center px-2">
                  {MOOD_TREND.map((data, i) => (
                    <div key={i} className="flex flex-col items-center absolute -translate-x-1/2" style={{ left: `${(100/7)*i + (100/14)}%`, top: `calc(${data.y}% - 14px)` }}>
                      <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-[10px] shadow-lg relative z-10" style={{ background: "#0d0f1a", border: `1.5px solid ${data.color}`, boxShadow: `0 0 8px ${data.color}50` }}>
                        {data.mood}
                      </div>
                      <span className="mt-[28px] text-[9px] text-[#64748b] font-medium absolute top-full">{data.day}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-4" /> {/* Spacer for labels */}
            </section>
          </div>
        )}
      </main>

      {/* ── Bottom Nav ── */}
      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-6 pb-8 pt-4 flex justify-between items-center z-50"
        style={{
          background: "rgba(13,15,26,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(167,139,250,0.15)",
        }}
      >
        <button className="flex flex-col items-center gap-1 w-12 text-[#64748b] hover:text-[#94a3b8] transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span className="text-[9px] font-semibold mt-0.5">หน้าหลัก</span>
        </button>

        <button className="flex flex-col items-center gap-1 w-12 text-[#a78bfa]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <span className="text-[9px] font-bold mt-0.5">นัดหมาย</span>
          <div className="w-1 h-1 rounded-full bg-[#a78bfa] mt-0.5 shadow-[0_0_6px_#a78bfa]" />
        </button>

        <button className="flex flex-col items-center justify-center gap-1 w-12 text-[#64748b] hover:text-[#94a3b8] transition-colors relative -top-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)", boxShadow: "0 8px 16px rgba(124,58,237,0.4)", color: "#fff" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
        </button>

        <button className="flex flex-col items-center gap-1 w-12 text-[#64748b] hover:text-[#94a3b8] transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <span className="text-[9px] font-semibold mt-0.5">ติดตาม</span>
        </button>

        <button className="flex flex-col items-center gap-1 w-12 text-[#64748b] hover:text-[#94a3b8] transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span className="text-[9px] font-semibold mt-0.5">โปรไฟล์</span>
        </button>
      </nav>

      <style>{`
        @keyframes shimmerSlide {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  )
}

// ── Utils ──
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "255, 255, 255"
}
