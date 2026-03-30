"use client"

import { useState } from "react"
import Link from "next/link"

interface DoctorFormPageProps {
  mode?: "create" | "edit"
}

export function DoctorFormPage({ mode = "create" }: DoctorFormPageProps) {
  const [activeDays, setActiveDays] = useState<string[]>(["จ.", "อ.", "พ.", "พฤ.", "ศ."])
  const [showPassword, setShowPassword] = useState(false)
  
  const DAYS = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."]
  
  const toggleDay = (day: string) => {
    if (activeDays.includes(day)) {
      setActiveDays(activeDays.filter(d => d !== day))
    } else {
      setActiveDays([...activeDays, day])
    }
  }

  return (
    <div className="mx-auto w-full max-w-[390px] min-h-screen pb-40 overflow-x-hidden" style={{ background: "#0d0f1a" }}>
      
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 pt-12 pb-4" style={{ background: "rgba(13,15,26,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          <Link href="/admin/doctors" className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(167,139,250,0.2)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </Link>
          <h1 className="text-[17px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            {mode === "create" ? "เพิ่มแพทย์ใหม่" : "แก้ไขข้อมูลแพทย์"}
          </h1>
        </div>
        
        <button className="text-sm font-bold text-[#a78bfa] hover:text-[#c4b5fd] transition-colors px-2">บันทึก</button>
      </header>

      <main className="flex flex-col px-5 mt-6 pb-10">
        
        {/* ── Photo Upload Section ── */}
        <section className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="relative group">
            <div className="h-32 w-32 rounded-full flex items-center justify-center text-[#475569]" style={{ background: "rgba(255,255,255,0.03)", border: "2px dashed rgba(167,139,250,0.3)" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <button className="absolute bottom-0 right-0 h-10 w-10 flex items-center justify-center rounded-full shadow-lg border-2 border-[#0d0f1a]" style={{ background: "linear-gradient(135deg, #2dd4bf 0%, #0891b2 100%)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            </button>
          </div>
          <span className="mt-3 text-xs font-bold text-[#2dd4bf] cursor-pointer hover:underline uppercase tracking-widest">อัปโหลดรูปภาพ</span>
        </section>

        {/* ── Form Sections ── */}
        <div className="flex flex-col gap-6">
          
          {/* Section 1: ข้อมูลส่วนตัว */}
          <section className="flex flex-col gap-4 animate-slide-up" style={{ animationDelay: "50ms" }}>
            <h3 className="text-[11px] font-bold text-[#2dd4bf] tracking-widest uppercase mb-1 font-mono">// ข้อมูลส่วนตัว</h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#94a3b8] px-1">ชื่อ-นามสกุล</label>
              <input type="text" placeholder="ระบุชื่อและนามสกุล" className="w-full rounded-xl py-3 px-4 text-sm text-white focus:outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }} />
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[13px] font-semibold text-[#94a3b8] px-1">เลขใบประกอบวิชาชีพ</label>
              <div className="relative">
                <input type="text" placeholder="เลขที่ใบอนุญาต..." className="w-full rounded-xl py-3 px-4 pr-24 text-sm text-white focus:outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }} />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#10b981]/15 border border-[#10b981]/30">
                  <span className="text-[9px] font-bold text-[#10b981]">VERIFIED</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#94a3b8] px-1">วันเกิด</label>
                <div className="relative">
                  <input type="text" placeholder="วว/ดด/ปปปป" className="w-full rounded-xl py-3 pl-4 pr-10 text-sm text-white focus:outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }} />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a78bfa]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#94a3b8] px-1">เพศ</label>
                <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }}>
                  {["ชาย", "หญิง"].map(g => (
                    <button key={g} className={`flex-1 rounded-lg py-1.5 text-[11px] font-bold transition-all ${g === "ชาย" ? "bg-[#a78bfa] text-white" : "text-[#64748b]"}`}>{g}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#94a3b8] px-1">เบอร์โทรศัพท์</label>
              <div className="flex items-center gap-2">
                <div className="w-16 h-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white">🇹🇭</div>
                <input type="tel" placeholder="0x-xxx-xxxx" className="flex-1 rounded-xl py-3 px-4 text-sm text-white focus:outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }} />
              </div>
            </div>
          </section>

          {/* Section 2: ข้อมูลวิชาชีพ */}
          <section className="flex flex-col gap-4 animate-slide-up" style={{ animationDelay: "150ms" }}>
            <h3 className="text-[11px] font-bold text-[#2dd4bf] tracking-widest uppercase mb-1 font-mono">// ข้อมูลวิชาชีพ</h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#94a3b8] px-1">สาขาเฉพาะทาง</label>
              <select className="w-full rounded-xl py-3 px-4 text-sm text-white focus:outline-none appearance-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }}>
                <option>จิตแพทย์</option>
                <option>นักจิตวิทยา</option>
                <option>พยาบาลเฉพาะทาง</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#94a3b8] px-1">ประสบการณ์ (ปี)</label>
              <input type="number" placeholder="เช่น 5" className="w-full rounded-xl py-3 px-4 text-sm text-white focus:outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }} />
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-[13px] font-semibold text-[#94a3b8] px-1">ตารางทำงาน</label>
              <div className="flex justify-between gap-1">
                {DAYS.map(day => (
                  <button 
                    key={day} 
                    onClick={() => toggleDay(day)}
                    className={`h-10 w-10 flex items-center justify-center rounded-xl text-[10px] font-bold transition-all border ${activeDays.includes(day) ? "bg-[#a78bfa] border-transparent text-white" : "bg-white/3 border-white/5 text-[#475569]"}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#94a3b8] px-1">เวลาทำการ</label>
              <div className="flex items-center gap-3">
                <input type="time" defaultValue="08:00" className="flex-1 rounded-xl py-3 px-4 text-sm text-white focus:outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }} />
                <span className="text-[#64748b]">→</span>
                <input type="time" defaultValue="16:00" className="flex-1 rounded-xl py-3 px-4 text-sm text-white focus:outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }} />
              </div>
            </div>
          </section>

          {/* Section 3: บัญชีระบบ */}
          <section className="flex flex-col gap-4 animate-slide-up" style={{ animationDelay: "250ms" }}>
            <h3 className="text-[11px] font-bold text-[#2dd4bf] tracking-widest uppercase mb-1 font-mono">// บัญชีระบบ</h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#94a3b8] px-1">อีเมล</label>
              <input type="email" placeholder="doctor@hospital.com" className="w-full rounded-xl py-3 px-4 text-sm text-white focus:outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#94a3b8] px-1">รหัสผ่านเริ่มต้น</label>
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="ระบุรหัสผ่าน..." className="w-full rounded-xl py-3 px-4 pr-11 text-sm text-white focus:outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }} />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b]">
                    {showPassword ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>}
                  </button>
                </div>
                <button className="self-end text-[11px] font-bold text-[#a78bfa] px-3 py-1.5 rounded-lg bg-[#a78bfa]/10 border border-[#a78bfa]/20 active:scale-95 transition-all">สร้างรหัสอัตโนมัติ</button>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <label className="text-[13px] font-semibold text-[#94a3b8] px-1">สิทธิ์การเข้าถึง</label>
              {[
                { label: "ดูข้อมูลอาการระบุผู้ป่วย", active: true },
                { label: "แก้ไขและจัดการนัดหมาย", active: true },
                { label: "ส่งออกรายงานประจำเดือน", active: false }
              ].map((right, idx) => (
                <div key={idx} className="flex items-center justify-between px-2">
                  <span className="text-[13px] text-[#f1f5f9]">{right.label}</span>
                  <div className={`w-10 h-5 rounded-full relative p-1 transition-colors duration-200 cursor-pointer ${right.active ? "bg-[#10b981]" : "bg-[#475569]"}`}>
                    <div className={`h-3 w-3 bg-white rounded-full transition-transform duration-200 ${right.active ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* ── Bottom Sticky Buttons ── */}
      <div 
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-5 py-6 flex flex-col gap-2 z-50 rounded-t-3xl"
        style={{
          background: "linear-gradient(to top, rgba(13,15,26,0.95) 70%, transparent 100%)",
          backdropFilter: "blur(10px)"
        }}
      >
        <button
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-bold text-white transition-all active:scale-95 shadow-lg"
          style={{
            background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
            boxShadow: "0 8px 32px rgba(124,58,237,0.4)"
          }}
        >
          บันทึกข้อมูล
        </button>
        <button className="w-full py-3 text-sm font-bold text-[#64748b] transition-colors hover:text-[#94a3b8] active:scale-95">ยกเลิก</button>
      </div>
      
    </div>
  )
}
