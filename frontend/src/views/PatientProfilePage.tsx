"use client"

import Link from "next/link"
import { useState } from "react"

interface PatientProfilePageProps {
  patientId: string
}

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

export function PatientProfilePage({ patientId }: PatientProfilePageProps) {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("อารมณ์")

  return (
    <div className="mx-auto w-full max-w-md min-h-screen pb-40">
      
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-[60] flex items-center justify-between px-6 pt-12 pb-6 glass border-none rounded-none backdrop-blur-3xl">
        <Link href="/dashboard" className="h-11 w-11 rounded-2xl glass-light border-white/5 flex items-center justify-center text-ink tap-active">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </Link>
        <h1 className="text-lg font-bold tracking-tight">Patient Profile</h1>
        <button className="h-11 w-11 rounded-2xl glass-light border-white/5 flex items-center justify-center text-ink tap-active">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
        </button>
      </header>

      <main className="px-6 space-y-8 mt-6">
        
        {/* ── Hero Card ── */}
        <section className="glass p-8 rounded-[40px] text-center relative overflow-hidden animate-entrance">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary" />
          <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
          
          <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[32px] text-4xl font-bold bg-gradient-to-br from-primary to-violet-600 text-white shadow-2xl shadow-primary/30 border border-white/10">
            ส
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight">นายสมชาย ใจดี</h2>
          <p className="mt-1 font-bold text-xs text-secondary tracking-widest uppercase">HN 0014285</p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {['อายุ 35 ปี', 'เพศชาย', 'กรุ๊ป B+'].map((stat, i) => (
              <span key={i} className="pill pill-lavender text-[10px] py-1 px-4">{stat}</span>
            ))}
          </div>

          <div className="mt-6">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider">โรคซึมเศร้า (MDD)</span>
            </div>
          </div>
        </section>

        {/* ── Tabs Row ── */}
        <div className="flex w-full overflow-x-auto pb-2 no-scrollbar animate-entrance [animation-delay:100ms]">
          <div className="flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                  activeTab === tab ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'text-subtle border-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content Area (อารมณ์ Tab) ── */}
        {activeTab === "อารมณ์" && (
          <div className="space-y-6 animate-entrance [animation-delay:200ms]">
            
            {/* Mood History Chart */}
            <section className="glass p-6 rounded-[32px] border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold tracking-tight uppercase text-muted tracking-widest">ประวัติอารมณ์</h3>
                <span className="pill pill-lavender text-[9px]">7 วันย้อนหลัง</span>
              </div>

              <div className="relative h-[140px] w-full mt-4">
                <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                  <path
                    d={`M ${100/14}% ${MOOD_DATA[0].y}% ` + MOOD_DATA.slice(1).map((d, i) => `L ${(100/7)*(i+1) + (100/14)}% ${d.y}%`).join(" ")}
                    fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
                    className="opacity-40"
                  />
                </svg>

                <div className="absolute inset-0 flex justify-between items-center px-0">
                  {MOOD_DATA.map((data, i) => (
                    <div key={i} className="flex flex-col items-center absolute -translate-x-1/2" style={{ left: `${(100/7)*i + (100/14)}%`, top: `${data.y}%` }}>
                      <div className="h-9 w-9 rounded-xl glass-light border-white/10 flex items-center justify-center text-xl shadow-lg relative -translate-y-1/2">
                        {data.mood}
                      </div>
                      <span className="text-[10px] font-bold text-subtle absolute top-6">{data.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Risk Assessment */}
            <section className="glass p-6 rounded-[32px] border-white/5 space-y-6">
              <h3 className="text-sm font-bold tracking-tight uppercase text-muted tracking-widest">ประเมินความเสี่ยง</h3>
              
              <div className="space-y-5">
                {[
                  { label: 'PHQ-9 (ซึมเศร้า)', score: 12, max: 27, color: 'bg-rose-500' },
                  { label: 'GAD-7 (วิตกกังวล)', score: 8, max: 21, color: 'bg-orange-500' }
                ].map((test, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-bold">{test.label}</p>
                      <p className="text-[13px] font-bold">
                        <span className="text-lg">{test.score}</span><span className="text-muted">/{test.max}</span>
                      </p>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                      <div className={`h-full ${test.color}`} style={{ width: `${(test.score/test.max)*100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Medication */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold tracking-tight uppercase text-muted tracking-widest px-1">ยาที่ได้รับ</h3>
              <div className="space-y-3">
                {[
                  { name: 'Fluoxetine', dose: '20 mg', schedule: 'เช้า (8:00)', desc: 'ฟลูออกซิทีน' },
                  { name: 'Lorazepam', dose: '0.5 mg', schedule: 'ก่อนนอน', desc: 'ลอราซีแพม' }
                ].map((med, i) => (
                  <div key={i} className="glass-light p-5 rounded-[24px] border-white/5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[15px]">{med.name}</p>
                      <p className="text-[11px] text-muted font-bold mt-0.5">{med.desc} · {med.dose}</p>
                    </div>
                    <span className="pill pill-lavender text-[9px]">{med.schedule}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* ── Bottom Sticky Action Bar ── */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] p-6 z-[70] animate-entrance">
        <div className="glass p-4 rounded-[32px] flex flex-col gap-3 shadow-2xl shadow-black/40 backdrop-blur-3xl">
          <button className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 tap-active">
            บันทึกการพบ (Follow up)
          </button>
          <button className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 font-bold text-sm text-ink tap-active">
            นัดหมายถัดไป
          </button>
        </div>
      </footer>

    </div>
  )
}

