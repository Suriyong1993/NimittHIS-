"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuthStore } from "../store/authStore"

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [activeMood, setActiveMood] = useState<number | null>(null)

  const MOODS = [
    { emoji: "😢", label: "แย่มาก", color: "from-rose-500/20" },
    { emoji: "😔", label: "ไม่ดี",  color: "from-orange-500/20" },
    { emoji: "😐", label: "ปานกลาง", color: "from-blue-500/20" },
    { emoji: "🙂", label: "ดี",    color: "from-teal-500/20" },
    { emoji: "😊", label: "ดีมาก",  color: "from-amber-500/20" }
  ]

  return (
    <div className="mx-auto w-full max-w-md min-h-screen pb-32">
      
      {/* ── Top Bar ── */}
      <header className="flex items-center justify-between px-6 pt-12 pb-6 animate-entrance">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-primary/25">
            {user?.firstName?.charAt(0) ?? "ว"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink leading-tight tracking-tight">
              สวัสดี, คุณหมอ{user?.firstName ?? "วิชัย"}
            </h1>
            <p className="text-[11px] font-bold text-muted uppercase tracking-widest mt-0.5">
              วันจันทร์ที่ 30 มีนาคม 2569
            </p>
          </div>
        </div>
        <button className="h-11 w-11 rounded-2xl glass-light border-white/5 flex items-center justify-center text-ink relative tap-active">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-secondary ring-4 ring-bg-deep shadow-[0_0_10px_var(--color-secondary)]" />
        </button>
      </header>

      <main className="px-6 space-y-8">
        
        {/* ── Mood Check Hero ── */}
        <section className="glass p-8 rounded-[40px] relative overflow-hidden animate-entrance [animation-delay:100ms]">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary" />
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold">อารมณ์วันนี้เป็นอย่างไร?</h2>
            <p className="text-muted text-sm mt-1">บันทึกสภาวะจิตใจเพื่อการติดตามที่แม่นยำ</p>
          </div>

          <div className="flex justify-between gap-2">
            {MOODS.map((mood, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMood(idx)}
                className={`group flex flex-col items-center gap-3 transition-all duration-500 tap-active ${activeMood === idx ? 'scale-110' : 'opacity-60 grayscale-[40%]'}`}
              >
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-3xl transition-all shadow-xl ${
                  activeMood === idx ? `bg-gradient-to-b ${mood.color} to-transparent border-primary/30 shadow-primary/10` : 'glass-light border-transparent'
                }`}>
                  {mood.emoji}
                </div>
              </button>
            ))}
          </div>

          <button
            className={`mt-8 w-full h-14 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 tap-active ${
              activeMood !== null ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-white/5 text-muted pointer-events-none'
            }`}
          >
            บันทึกผลทางเลือกระบบ
          </button>
        </section>

        {/* ── Quick Stats Grid ── */}
        <section className="grid grid-cols-3 gap-4 animate-entrance [animation-delay:200ms]">
          {[
            { label: 'ผู้ป่วยวันนี้', value: '8', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>, color: 'text-teal-400', bg: 'bg-teal-500/10' },
            { label: 'นัดถัดไป', value: '14:00', icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'ฉุกเฉิน', value: '3', icon: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>, color: 'text-rose-400', bg: 'bg-rose-500/10' }
          ].map((item, i) => (
            <div key={i} className="glass-light p-4 rounded-[24px] border-white/5 space-y-3">
              <div className={`h-10 w-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">{item.icon}</svg>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-muted uppercase tracking-tight">{item.label}</p>
                <p className="text-lg font-bold tracking-tight">{item.value}</p>
              </div>
            </div>
          ))}
        </section>


        {/* ── Risk Monitoring ── */}
        <section className="space-y-4 animate-entrance [animation-delay:300ms]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-tight px-1">ผู้ป่วยเฝ้าระวัง</h3>
            <button className="text-xs font-bold text-secondary px-1">ดูทั้งหมด</button>
          </div>

          <div className="space-y-3">
            {[
              { name: 'สมศักดิ์ รักดี', tag: 'ซึมเศร้า', risk: 85, color: 'bg-rose-500' },
              { name: 'มาลี สุขใจ', tag: 'วิตกกังวล', risk: 60, color: 'bg-orange-500' }
            ].map((p, i) => (
              <div key={i} className="glass-light p-5 rounded-[28px] border-white/5 flex items-center gap-4 group hover:bg-white/[0.06] transition-colors">
                <div className="h-14 w-14 rounded-2xl bg-white/5 overflow-hidden flex-shrink-0">
                  <img src={`https://i.pravatar.cc/150?u=${p.name}`} alt={p.name} className="h-full w-full object-cover grayscale-[30%]" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm">{p.name}</p>
                    <span className="pill pill-lavender text-[9px] py-0">{p.tag}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${p.color}`} style={{ width: `${p.risk}%` }} />
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[11px] font-bold ${p.risk > 80 ? 'text-rose-400' : 'text-orange-400'}`}>
                    {p.risk > 80 ? 'วิกฤต' : 'ปานกลาง'}
                  </p>
                  <p className="text-[10px] text-muted font-bold mt-1 uppercase">Alert</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ── Refined Bottom Nav ── */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[390px] h-20 glass rounded-[28px] flex justify-around items-center px-4 z-50 animate-float">
        {[
          { icon: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>, active: true },
          { icon: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></> },
          { icon: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>, special: true },
          { icon: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></> },
          { icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></> }
        ].map((btn, i) => (

          <button key={i} className={`flex items-center justify-center tap-active ${
            btn.special ? 'h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-violet-600 text-white shadow-lg shadow-primary/30 relative -top-4' : 
            btn.active ? 'text-primary' : 'text-subtle hover:text-muted'
          }`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{btn.icon}</svg>
          </button>
        ))}
      </nav>

    </div>
  )
}

