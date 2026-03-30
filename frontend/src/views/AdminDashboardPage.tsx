"use client"

import Link from "next/link"

const QUICK_ACTIONS = [
  { id: "add-doctor", icon: "👨‍⚕️", label: "เพิ่มแพทย์", count: 12, color: "#a78bfa", grad: "linear-gradient(135deg, #a78bfa, #7c3aed)" },
  { id: "add-patient", icon: "🧑", label: "เพิ่มผู้ป่วย", count: 428, color: "#2dd4bf", grad: "linear-gradient(135deg, #2dd4bf, #0891b2)" },
  { id: "add-appt", icon: "📅", label: "สร้างนัดหมาย", count: 85, color: "#d8b4fe", grad: "linear-gradient(135deg, #d8b4fe, #a855f7)" },
  { id: "add-med", icon: "💊", label: "เพิ่มยา", count: 156, color: "#fb923c", grad: "linear-gradient(135deg, #fb923c, #ea580c)" },
]

const STATS = [
  { label: "แพทย์ทั้งหมด", value: "12", color: "#a78bfa" },
  { label: "ผู้ป่วยทั้งหมด", value: "428", color: "#2dd4bf" },
  { label: "นัดวันนี้", value: "24", color: "#f43f5e" },
]

const ACTIVITIES = [
  { id: 1, text: "เพิ่มผู้ป่วยใหม่: นายสมชาย วีระ", time: "10 นาทีที่แล้ว", type: "add-patient", icon: "🧑", color: "#2dd4bf" },
  { id: 2, text: "เพิ่มยา: Fluoxetine 20mg", time: "45 นาทีที่แล้ว", type: "add-med", icon: "💊", color: "#fb923c" },
  { id: 3, text: "แก้ไขนัดหมาย: พญ.อรัญญา", time: "2 ชั่วโมงที่แล้ว", type: "edit-appt", icon: "📅", color: "#a78bfa" },
  { id: 4, text: "ระงับบัญชีแพทย์ชั่วคราว", time: "เมื่อวาน 14:20", type: "del-doctor", icon: "⚠", color: "#f43f5e" },
]

export function AdminDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[390px] min-h-screen pb-32" style={{ background: "#0d0f1a" }}>
      
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 pt-12 pb-4" style={{ background: "rgba(13,15,26,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div className="flex w-10 h-10 items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(167,139,250,0.2)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </div>
        <h1 className="text-[17px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>แผงควบคุมผู้ดูแล</h1>
        
        <div className="flex flex-col items-center">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026703b" alt="Admin" className="h-[34px] w-[34px] rounded-full object-cover ring-2 ring-[#a78bfa]" />
          <span className="absolute mt-7 rounded-sm px-1.5 py-[1px] text-[8px] font-bold tracking-widest uppercase shadow-sm" style={{ background: "rgba(167,139,250,0.9)", color: "#fff" }}>ผู้ดูแลระบบ</span>
        </div>
      </header>

      <main className="flex flex-col gap-6 px-5 mt-4">
        
        {/* ── Quick Action Grid ── */}
        <section className="grid grid-cols-2 gap-3 animate-slide-up">
          {QUICK_ACTIONS.map((action, i) => (
            <button
              key={action.id}
              className="relative flex flex-col items-start gap-4 rounded-3xl p-4 transition-transform active:scale-95"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(167,139,250,0.15)",
                boxShadow: "0 10px 30px rgba(13,15,26,0.5)",
                animationDelay: `${i * 50}ms`
              }}
            >
              <div 
                className="flex h-11 w-11 items-center justify-center rounded-2xl text-[20px] shadow-lg"
                style={{ background: action.grad, boxShadow: `0 8px 20px ${action.color}40` }}
              >
                {action.icon}
              </div>
              <div className="flex flex-col items-start w-full">
                <span className="text-[14px] font-bold text-[#f1f5f9]" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{action.label}</span>
              </div>
              
              <div 
                className="absolute bottom-4 right-4 rounded-full px-2 py-0.5 text-[10px] font-mono font-bold"
                style={{ background: `${action.color}15`, color: action.color, border: `1px solid ${action.color}30` }}
              >
                {action.count}
              </div>
            </button>
          ))}
        </section>

        {/* ── Stats Overview ── */}
        <section className="animate-slide-up" style={{ animationDelay: "150ms" }}>
          <div className="flex gap-3">
            {STATS.map((stat, i) => (
              <div key={i} className="flex-1 rounded-2xl p-3.5 text-center flex flex-col justify-center gap-1" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.1)" }}>
                <span className="text-[10px] font-bold text-[#94a3b8]" style={{ fontFamily: "'Sarabun', sans-serif" }}>{stat.label}</span>
                <span className="text-2xl font-bold font-mono tracking-tighter" style={{ color: stat.color, textShadow: `0 0 16px ${stat.color}60` }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Recent Activity ── */}
        <section className="animate-slide-up mb-2" style={{ animationDelay: "200ms" }}>
          <h3 className="mb-4 text-[15px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>กิจกรรมล่าสุด</h3>
          
          <div className="flex flex-col gap-3">
            {ACTIVITIES.map((act) => (
              <div key={act.id} className="flex items-center gap-3 rounded-[20px] p-3.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div 
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl text-[16px]"
                  style={{ background: `${act.color}15`, border: `1px solid ${act.color}30` }}
                >
                  {act.icon}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p className="text-[13px] font-semibold text-[#f1f5f9] truncate">{act.text}</p>
                  <p className="text-[11px] font-mono text-[#64748b]">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-xl py-3 text-xs font-bold text-[#a78bfa] transition-colors hover:bg-white/5 active:bg-white/10" style={{ border: "1px dashed rgba(167,139,250,0.3)" }}>
            ดูกิจกรรมทั้งหมด
          </button>
        </section>

      </main>

      {/* ── Bottom Nav (Admin) ── */}
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
          <span className="text-[9px] font-bold mt-0.5">ภาพรวม</span>
          <div className="w-1 h-1 rounded-full bg-[#a78bfa] mt-0.5 shadow-[0_0_6px_#a78bfa]" />
        </button>

        <button className="flex flex-col items-center gap-1 w-12 text-[#64748b] hover:text-[#94a3b8] transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <span className="text-[9px] font-semibold mt-0.5">แพทย์</span>
        </button>

        <button className="flex flex-col items-center gap-1 w-12 text-[#64748b] hover:text-[#94a3b8] transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <span className="text-[9px] font-semibold mt-0.5">ผู้ป่วย</span>
        </button>

        <button className="flex flex-col items-center gap-1 w-12 text-[#64748b] hover:text-[#94a3b8] transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <span className="text-[9px] font-semibold mt-0.5">นัดหมาย</span>
        </button>

        <button className="flex flex-col items-center gap-1 w-12 text-[#64748b] hover:text-[#94a3b8] transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          <span className="text-[9px] font-semibold mt-0.5">ตั้งค่า</span>
        </button>
      </nav>

    </div>
  )
}
