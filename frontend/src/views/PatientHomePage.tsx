"use client"

import { useState } from "react"
import Link from "next/link"

export function PatientHomePage() {
  const [moodLogged, setMoodLogged] = useState(false)

  return (
    <div className="mx-auto w-full max-w-[390px] min-h-screen pb-32 overflow-x-hidden" style={{ background: "#0d0f1a" }}>
      
      {/* ── Top Bar ── */}
      <header className="flex items-center justify-between px-6 pt-12 pb-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Rajdhani', sans-serif" }}>สวัสดี, คุณสมชาย</h1>
          <p className="text-xs text-[#64748b] mt-1">วันนี้เป็นอย่างไรบ้าง? เราพร้อมดูแลคุณเสมอ</p>
        </div>
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-2 border-[#a78bfa]/20 bg-[#a78bfa]/5 flex items-center justify-center overflow-hidden">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
          </div>
          <div className="absolute top-0 right-0 h-3 w-3 rounded-full bg-[#10b981] border-2 border-[#0d0f1a]" />
        </div>
      </header>

      <main className="px-6 flex flex-col gap-8">
        
        {/* ── Mood Check-in Hero ── */}
        {!moodLogged ? (
          <section 
            className="group relative rounded-[40px] p-8 overflow-hidden transition-all duration-500 animate-fade-in"
            style={{ 
              background: "linear-gradient(135deg, rgba(167,139,250,0.1) 0%, rgba(124,58,237,0.1) 100%)",
              border: "1px solid rgba(167,139,250,0.2)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
            }}
          >
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#a78bfa]/10 blur-[80px] pointer-events-none" />
            
            <div className="relative flex flex-col gap-6">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-[#a78bfa]/20 text-[#a78bfa] text-xl">🧘‍♀️</div>
                 <span className="text-[11px] font-bold text-[#a78bfa] uppercase tracking-[0.2em] font-mono">Check-in อารมณ์วันนี้</span>
              </div>
              
              <h2 className="text-xl font-bold text-white pr-10 leading-snug">บันทึกความรู้สึกของคุณตอนนี้ เพื่อช่วยให้แพทย์เข้าใจคุณมากขึ้น</h2>
              
              <Link 
                href="/app/mood/log"
                className="w-fit px-6 py-3 rounded-2xl font-bold text-[14px] text-white transition-all active:scale-95 flex items-center gap-3 shadow-lg group-hover:shadow-[#a78bfa]/30"
                style={{ background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)" }}
              >
                บันทึกอารมณ์วันนี้
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
            </div>
          </section>
        ) : (
          <section className="rounded-3xl p-6 bg-white/3 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <span className="text-3xl animate-bounce">😊</span>
                 <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">ยอดเยี่ยม!</span>
                    <span className="text-[11px] text-[#2dd4bf]">คุณบันทึกอารมณ์พบบ่อย: มีความสุข</span>
                 </div>
              </div>
              <Link href="/app/mood/history" className="text-[11px] font-bold text-[#a78bfa] uppercase border-b border-[#a78bfa]/30 pb-0.5">ดูประวัติ</Link>
          </section>
        )}

        {/* ── Quick Actions Grid ── */}
        <div className="grid grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
           {[
             { title: "นัดหมายพบแพทย์", icon: "📅", color: "#a78bfa", href: "/app/appointments", sub: "ดูเวลานัด/จองคิวใหม่" },
             { title: "ไดอารี่ของฉัน", icon: "📔", color: "#2dd4bf", href: "/app/journal", sub: "บันทึกเรื่องราวส่วนตัว" },
             { title: "แบบประเมินสุขภาพจิต", icon: "🧠", color: "#fb923c", href: "/app/assessments/phq9", sub: "PHQ-9 / GAD-7" },
             { title: "แจ้งเตือนสำคัญ", icon: "🔔", color: "#f43f5e", href: "/app/notifications", sub: "รายการที่ต้องจัดการ" },
           ].map((action, i) => (
             <Link 
               href={action.href}
               key={i}
               className="group flex flex-col gap-4 p-5 rounded-[32px] transition-all duration-300 active:scale-95"
               style={{ 
                 background: "rgba(255,255,255,0.03)", 
                 border: "1px solid rgba(255,255,255,0.08)",
                 boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
               }}
             >
                <div className="h-10 w-10 flex items-center justify-center rounded-2xl text-2xl transition-transform group-hover:scale-110" style={{ background: `${action.color}15` }}>
                   {action.icon}
                </div>
                <div className="flex flex-col">
                   <span className="text-sm font-bold text-white leading-tight">{action.title}</span>
                   <span className="text-[10px] text-[#64748b] mt-1 font-medium">{action.sub}</span>
                </div>
             </Link>
           ))}
        </div>

        {/* ── Upcoming Appointment Card ── */}
        <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
           <h3 className="text-[13px] font-bold text-[#94a3b8] tracking-widest uppercase mb-4 px-2 font-mono">// นัดหมายที่กำลังจะมาถึง</h3>
           <div 
             className="relative rounded-3xl p-6 overflow-hidden" 
             style={{ 
               background: "rgba(255,255,255,0.03)", 
               border: "1px solid rgba(167,139,250,0.12)"
             }}
           >
              <div className="flex items-center justify-between mb-5">
                 <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">นัดหมายพบแพทย์</span>
                    <span className="text-[11px] text-[#a78bfa] mt-0.5">รอรับการยืนยัน...</span>
                 </div>
                 <div className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/20 animate-pulse">Pending</div>
              </div>

              <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full border-2 border-white/5 overflow-hidden">
                       <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=doctor1" alt="dr" />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[13px] font-bold text-white">นพ.วิชัย สมบูรณ์</span>
                       <span className="text-[11px] text-[#64748b]">ผู้เชี่ยวชาญด้านจิตเวชผู้ใหญ่</span>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-6 py-4 border-y border-white/5">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">วันที่</span>
                       <span className="text-[14px] font-bold text-white mt-1">30 มี.ค. 2569</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">เวลา</span>
                       <span className="text-[14px] font-bold text-white mt-1">09:00 - 10:00 น.</span>
                    </div>
                 </div>

                 <div className="flex gap-3 mt-2">
                    <button className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold text-white transition-all active:scale-95 shadow-md" style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", color: "#a78bfa" }}>
                       เลื่อนนัดหมาย
                    </button>
                    <button className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold text-white transition-all active:scale-95 shadow-md" style={{ background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)" }}>
                       ยืนยันเข้าพบ
                    </button>
                 </div>
              </div>
           </div>
        </section>

      </main>

      {/* ── Bottom Navigation ── */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-8 py-6 z-[100] flex items-center justify-between pointer-events-none">
        <div 
          className="absolute inset-x-4 bottom-4 h-20 rounded-[32px] border border-white/10 pointer-events-auto shadow-2xl"
          style={{ background: "rgba(13,15,26,0.9)", backdropFilter: "blur(20px)" }}
        >
           <div className="h-full w-full flex items-center justify-around px-2">
              <button className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-[#a78bfa]/10 text-[#a78bfa]">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                 <span className="text-[9px] font-bold tracking-widest">HOME</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 p-2 text-[#475569]">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                 <span className="text-[9px] font-bold tracking-widest">CHAT</span>
              </button>
              <div className="h-full w-20" /> {/* Spacer for central FAB */}
              <button className="flex flex-col items-center gap-1.5 p-2 text-[#475569]">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                 <span className="text-[9px] font-bold tracking-widest">RECORD</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 p-2 text-[#475569]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                 <span className="text-[9px] font-bold tracking-widest">PROFILE</span>
              </button>
           </div>
        </div>

        {/* Central Square FAB */}
        <button 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 h-16 w-16 rounded-3xl pointer-events-auto flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 active:scale-90"
          style={{ 
            background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
            boxShadow: "0 10px 40px rgba(124,58,237,0.5)"
          }}
        >
           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </nav>

    </div>
  )
}
