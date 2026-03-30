"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuthStore } from "../store/authStore"

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [activeMood, setActiveMood] = useState<number | null>(null)

  const MOODS = [
    { emoji: "😢", label: "แย่มาก", color: "#f43f5e" },
    { emoji: "😔", label: "ไม่ดี",  color: "#f97316" },
    { emoji: "😐", label: "ปานกลาง", color: "#60a5fa" },
    { emoji: "🙂", label: "ดี",    color: "#34d399" },
    { emoji: "😊", label: "ดีมาก",  color: "#fbbf24" }
  ]

  return (
    <div className="mx-auto w-full max-w-[390px] min-h-screen pb-24" style={{ background: "#0d0f1a" }}>
      
      {/* ── Top Bar ── */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold"
            style={{
              background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
              color: "#fff",
              boxShadow: "0 0 20px rgba(167,139,250,0.4)"
            }}
          >
            {user?.firstName?.charAt(0) ?? "ว"}
          </div>
          <div>
            <h1 className="text-[17px] font-bold text-[#f1f5f9] tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              สวัสดี, คุณหมอ{user?.firstName ?? "วิชัย"}
            </h1>
            <p className="text-xs text-[#94a3b8]" style={{ fontFamily: "'Sarabun', sans-serif" }}>
              วันจันทร์ที่ 30 มีนาคม 2569
            </p>
          </div>
        </div>
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(167,139,250,0.2)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f1f5f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#2dd4bf] ring-2 ring-[#0d0f1a]" style={{ boxShadow: "0 0 8px #2dd4bf" }} />
        </button>
      </header>

      <main className="flex flex-col gap-6 px-5 mt-2">
        
        {/* ── Mood Check Hero ── */}
        <section
          className="relative overflow-hidden rounded-[24px] p-6 animate-slide-up"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(167,139,250,0.15)",
            borderTop: "1px solid rgba(167,139,250,0.4)",
            boxShadow: "0 24px 64px rgba(13,15,26,0.5)"
          }}
        >
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: "linear-gradient(90deg, #a78bfa, #2dd4bf)" }} />
          
          <h2 className="text-lg font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            อารมณ์วันนี้เป็นอย่างไรบ้าง?
          </h2>
          <p className="mt-1 text-sm text-[#94a3b8]">บันทึกอารมณ์ประจำวัน</p>

          <div className="mt-6 flex justify-between px-1">
            {MOODS.map((mood, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMood(idx)}
                className="group flex flex-col items-center gap-2 transition-transform active:scale-90"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-2xl transition-all duration-300"
                  style={{
                    background: activeMood === idx ? `rgba(${hexToRgb(mood.color)}, 0.2)` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${activeMood === idx ? mood.color : "rgba(255,255,255,0.08)"}`,
                    boxShadow: activeMood === idx ? `0 0 20px rgba(${hexToRgb(mood.color)}, 0.4)` : "none",
                    filter: activeMood === idx ? "none" : "grayscale(80%) opacity(60%)",
                    transform: activeMood === idx ? "scale(1.15)" : "scale(1)"
                  }}
                >
                  {mood.emoji}
                </div>
              </button>
            ))}
          </div>

          <button
            className="mt-6 w-full rounded-2xl py-3.5 text-sm font-bold text-white transition-all active:scale-95"
            style={{
              background: activeMood !== null ? "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)" : "rgba(255,255,255,0.08)",
              boxShadow: activeMood !== null ? "0 0 20px rgba(167,139,250,0.4)" : "none",
              opacity: activeMood !== null ? 1 : 0.5
            }}
            disabled={activeMood === null}
          >
            บันทึกอารมณ์
          </button>
        </section>

        {/* ── Quick Stats Row ── */}
        <section className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "100ms" }}>
          {/* Card 1 */}
          <div className="rounded-[20px] p-3.5 flex flex-col gap-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }}>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: "rgba(45,212,191,0.15)", color: "#2dd4bf" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div>
              <p className="text-[10px] text-[#94a3b8] font-medium">ผู้ป่วยวันนี้</p>
              <p className="text-lg font-bold text-[#f1f5f9] font-mono leading-none mt-1">8</p>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="rounded-[20px] p-3.5 flex flex-col gap-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }}>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div>
              <p className="text-[10px] text-[#94a3b8] font-medium">นัดถัดไป</p>
              <p className="text-sm font-bold text-[#f1f5f9] font-mono leading-none mt-1">14:00 น.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-[20px] p-3.5 flex flex-col gap-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }}>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: "rgba(244,63,94,0.15)", color: "#f43f5e" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <div>
              <p className="text-[10px] text-[#94a3b8] font-medium">ต้องติดตาม</p>
              <p className="text-lg font-bold text-[#f1f5f9] font-mono leading-none mt-1">3</p>
            </div>
          </div>
        </section>

        {/* ── Risk Patients ── */}
        <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-[15px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>ผู้ป่วยที่ต้องติดตาม</h3>
            <button className="text-[11px] font-medium text-[#2dd4bf]">ดูทั้งหมด →</button>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Patient 1 */}
            <div className="flex items-center gap-3 rounded-[20px] p-3.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.12)" }}>
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="patient" className="h-12 w-12 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white truncate">สมศักดิ์ รักดี</p>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa" }}>ซึมเศร้า</span>
                </div>
                {/* Risk bar */}
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full w-[85%]" style={{ background: "linear-gradient(90deg, #a78bfa, #f43f5e)" }} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#f43f5e] font-bold">เสี่ยงสูง</p>
                <p className="text-[9px] text-[#64748b] font-mono mt-0.5">25 มี.ค.</p>
              </div>
            </div>

            {/* Patient 2 */}
            <div className="flex items-center gap-3 rounded-[20px] p-3.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.12)" }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold" style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}>
                ม
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white truncate">มาลี สุขใจ</p>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa" }}>วิตกกังวล</span>
                </div>
                {/* Risk bar */}
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full w-[60%]" style={{ background: "linear-gradient(90deg, #a78bfa, #fb923c)" }} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#fb923c] font-bold">ปานกลาง</p>
                <p className="text-[9px] text-[#64748b] font-mono mt-0.5">28 มี.ค.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Upcoming Appt ── */}
        <section className="animate-slide-up" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-[15px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>นัดหมายวันนี้</h3>
          </div>

          <div className="rounded-[24px] p-4 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }}>
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(45,212,191,0.15) 0%, transparent 70%)" }} />
            
            <div className="flex items-start justify-between relative z-10">
              <div className="flex gap-3">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704b" alt="patient" className="h-14 w-14 rounded-[18px] object-cover" />
                <div>
                  <p className="text-[15px] font-bold text-white">นพดล เจริญศิริ</p>
                  <p className="text-xs text-[#94a3b8] mt-0.5">HN 0014285</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold" style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa" }}>ซึมเศร้า</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-2 py-1 rounded-full text-[9px] font-bold flex items-center gap-1" style={{ background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.3)", color: "#2dd4bf" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-pulse" /> กำลังจะมาถึง
                </span>
                <p className="text-sm font-bold text-white font-mono mt-2">09:00</p>
                <p className="text-[10px] text-[#64748b] font-mono">10:00 น.</p>
              </div>
            </div>
          </div>
        </section>

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
        <button className="flex flex-col items-center gap-1 w-12 text-[#a78bfa]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span className="text-[9px] font-bold mt-0.5">หน้าหลัก</span>
          <div className="w-1 h-1 rounded-full bg-[#a78bfa] mt-0.5 shadow-[0_0_6px_#a78bfa]" />
        </button>

        <button className="flex flex-col items-center gap-1 w-12 text-[#64748b] hover:text-[#94a3b8] transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <span className="text-[9px] font-semibold mt-0.5">นัดหมาย</span>
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

    </div>
  )
}

// ── Utils ──
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "255, 255, 255"
}
