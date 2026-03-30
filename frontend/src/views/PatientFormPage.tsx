"use client"

import { useState } from "react"
import Link from "next/link"

const DOCTORS = [
  { id: "1", name: "นพ.วิชัย สมบูรณ์", specialty: "จิตแพทย์", photo: "https://i.pravatar.cc/150?u=doc1" },
  { id: "2", name: "พญ.อรัญญา ใจดี", specialty: "จิตแพทย์", photo: "https://i.pravatar.cc/150?u=doc2" },
  { id: "3", name: "ดร.สมชาย รักการ", specialty: "นักจิตวิทยา", photo: "https://i.pravatar.cc/150?u=doc3" },
]

export function PatientFormPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>("1")
  const [riskLevel, setRiskLevel] = useState("LOW")

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  return (
    <div className="mx-auto w-full max-w-[390px] min-h-screen pb-40 overflow-x-hidden" style={{ background: "#0d0f1a" }}>
      
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 pt-12 pb-4" style={{ background: "rgba(13,15,26,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          <Link href="/admin/patients" className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(167,139,250,0.2)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </Link>
          <h1 className="text-[17px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>เพิ่มผู้ป่วยใหม่</h1>
        </div>
      </header>

      {/* ── Progress Stepper ── */}
      <section className="px-8 mt-6">
        <div className="relative flex justify-between items-center">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 bg-white/5 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 bg-[#a78bfa] transition-all duration-500 z-0" 
            style={{ width: `${(currentStep - 1) * 50}%` }} 
          />

          {[1, 2, 3].map((step) => {
            const isActive = currentStep === step
            const isCompleted = currentStep > step
            return (
              <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                <div 
                  className={`h-9 w-9 flex items-center justify-center rounded-full transition-all duration-300 ${isActive ? "bg-[#a78bfa] shadow-[0_0_15px_rgba(167,139,250,0.5)] scale-110" : isCompleted ? "bg-[#10b981]" : "bg-[#0d0f1a] border-2 border-[#475569]"}`}
                >
                  {isCompleted ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : (
                    <span className={`text-sm font-bold ${isActive ? "text-white" : "text-[#64748b]"}`}>{step === 1 ? "①" : step === 2 ? "②" : "③"}</span>
                  )}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? "text-[#a78bfa]" : isCompleted ? "text-[#10b981]" : "text-[#475569]"}`}>
                  {step === 1 ? "ข้อมูลทั่วไป" : step === 2 ? "ประวัติสุขภาพ" : "มอบหมายแพทย์"}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      <main className="px-5 mt-10">
        
        {/* STEP 1: ข้อมูลทั่วไป */}
        {currentStep === 1 && (
          <div className="animate-fade-in flex flex-col gap-6">
            <section className="flex flex-col items-center mb-4">
              <div className="relative group">
                <div className="h-28 w-28 rounded-full flex items-center justify-center text-[#475569]" style={{ background: "rgba(255,255,255,0.03)", border: "2px dashed rgba(167,139,250,0.3)" }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <button className="absolute bottom-0 right-0 h-9 w-9 flex items-center justify-center rounded-full shadow-lg border-2 border-[#0d0f1a]" style={{ background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                </button>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="flex-1 flex flex-col gap-1.5 font-mono text-[11px] font-bold text-[#2dd4bf] uppercase tracking-widest leading-none bg-[#2dd4bf]/10 p-3 rounded-xl border border-[#2dd4bf]/20">
                  <span className="text-[9px] opacity-70">รหัสผู้ป่วย HN</span>
                  <div className="flex items-center gap-2 mt-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <span>HN00192 (ระบบสร้าง)</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#94a3b8] px-1">ชื่อ</label>
                  <input type="text" className="w-full rounded-xl py-3 px-4 text-sm text-white focus:outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }} />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#94a3b8] px-1">นามสกุล</label>
                  <input type="text" className="w-full rounded-xl py-3 px-4 text-sm text-white focus:outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }} />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#94a3b8] px-1">วันเกิด</label>
                  <input type="date" className="w-full rounded-xl py-3 px-4 text-sm text-white focus:outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }} />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#94a3b8] px-1">เพศ</label>
                  <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }}>
                    <button className="flex-1 rounded-lg py-1.5 text-[11px] font-bold bg-[#a78bfa] text-white">ชาย</button>
                    <button className="flex-1 rounded-lg py-1.5 text-[11px] font-bold text-[#64748b]">หญิง</button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#94a3b8] px-1">เบอร์โทรศัพท์</label>
                <input type="tel" placeholder="0x-xxx-xxxx" className="w-full rounded-xl py-3 px-4 text-sm text-white focus:outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#94a3b8] px-1">ที่อยู่</label>
                <textarea rows={2} className="w-full rounded-xl py-3 px-4 text-sm text-white focus:outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)" }} />
              </div>

              <div className="mt-2 flex flex-col gap-3 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-[11px] font-bold text-[#a78bfa] uppercase tracking-widest">// ผู้ติดต่อฉุกเฉิน</span>
                <div className="flex flex-col gap-3">
                  <input type="text" placeholder="ชื่อผู้ติดต่อ..." className="w-full rounded-xl py-2.5 px-4 text-sm bg-white/5 border border-white/10 text-white focus:outline-none" />
                  <input type="tel" placeholder="เบอร์โทรศัพท์..." className="w-full rounded-xl py-2.5 px-4 text-sm bg-white/5 border border-white/10 text-white focus:outline-none" />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* STEP 2: ประวัติสุขภาพ */}
        {currentStep === 2 && (
          <div className="animate-fade-in flex flex-col gap-6">
            <section className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#94a3b8] px-1">การวินิจฉัยเบื้องต้น</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {["ซึมเศร้า", "วิตกกังวล"].map(tag => (
                    <span key={tag} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/30">
                      {tag} ✕
                    </span>
                  ))}
                </div>
                <select className="w-full rounded-xl py-3 px-4 text-sm text-white focus:outline-none bg-white/5 border border-white/10 appearance-none">
                  <option>เลือกโรคสมาธิเพิ่ม...</option>
                  <option>Bipolar</option>
                  <option>PTSD</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#94a3b8] px-1">ระดับความเสี่ยง</label>
                <div className="flex gap-2">
                  {[
                    { label: "ต่ำ", id: "LOW", color: "#10b981" },
                    { label: "กลาง", id: "MEDIUM", color: "#fb923c" },
                    { label: "สูง", id: "HIGH", color: "#f43f5e" }
                  ].map(lvl => (
                    <button 
                      key={lvl.id}
                      onClick={() => setRiskLevel(lvl.id)}
                      className={`flex-1 rounded-xl py-3 text-xs font-bold transition-all border ${riskLevel === lvl.id ? "text-white" : "text-[#475569] bg-white/3 border-white/5"}`}
                      style={{ 
                        background: riskLevel === lvl.id ? lvl.color : "",
                        borderColor: riskLevel === lvl.id ? "transparent" : "",
                        boxShadow: riskLevel === lvl.id ? `0 4px 15px ${lvl.color}40` : ""
                      }}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#94a3b8] px-1">ยาที่ใช้อยู่ปัจจุบัน</label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[12px] text-white flex-1">Fluoxetine 20mg</span>
                    <button className="text-[#f43f5e]">🗑️</button>
                  </div>
                  <button className="w-full py-2.5 rounded-xl border border-dashed border-[#a78bfa]/30 text-[#a78bfa] text-xs font-bold">+ เพิ่มรายการยา</button>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-semibold text-[#94a3b8]">ประวัติการรักษาก่อนหน้า</label>
                  <div className="flex p-1 rounded-lg bg-white/5 w-24">
                    <button className="flex-1 rounded-md text-[10px] font-bold py-1 transition-all bg-[#a78bfa]">มี</button>
                    <button className="flex-1 rounded-md text-[10px] font-bold py-1 transition-all text-[#475569]">ไม่มี</button>
                  </div>
                </div>
                <textarea placeholder="ระบุชื่อโรงพยาบาล หรือระยะเวลาที่รักษา..." rows={3} className="w-full rounded-xl py-3 px-4 text-sm bg-white/5 border border-white/10 text-white focus:outline-none" />
              </div>
            </section>
          </div>
        )}

        {/* STEP 3: มอบหมายแพทย์ */}
        {currentStep === 3 && (
          <div className="animate-fade-in flex flex-col gap-6">
            <section className="flex flex-col gap-4">
              <label className="text-[13px] font-semibold text-[#94a3b8] px-1">ระบุแพทย์ผู้ดูแล</label>
              <div className="flex flex-col gap-2">
                {DOCTORS.map(doc => (
                  <button 
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc.id)}
                    className={`flex items-center gap-3 p-4 rounded-2xl transition-all border ${selectedDoctor === doc.id ? "bg-[#a78bfa]/15 border-[#a78bfa] shadow-[0_5px_15px_rgba(167,139,250,0.15)]" : "bg-white/3 border-white/5 opacity-60"}`}
                  >
                    <img src={doc.photo} alt={doc.name} className="h-12 w-12 rounded-full object-cover" />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-bold text-white">{doc.name}</p>
                      <p className="text-[10px] text-[#a78bfa] font-bold uppercase">{doc.specialty}</p>
                    </div>
                    {selectedDoctor === doc.id && (
                      <div className="h-6 w-6 flex items-center justify-center rounded-full bg-[#a78bfa]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-1.5 mt-4">
                <label className="text-[13px] font-semibold text-[#94a3b8] px-1">วันนัดหมายครั้งแรก</label>
                <input type="date" className="w-full rounded-xl py-3 px-4 text-sm text-white focus:outline-none bg-white/5 border border-white/10" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#94a3b8] px-1">หมายเหตุสำหรับแพทย์</label>
                <textarea placeholder="ระบุสิ่งที่ต้องการฝากถึงแพทย์..." rows={3} className="w-full rounded-xl py-3 px-4 text-sm text-white focus:outline-none bg-white/5 border border-white/10" />
              </div>
            </section>
          </div>
        )}
      </main>

      {/* ── Bottom Sticky Bar ── */}
      <div 
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-5 py-6 flex flex-col items-center gap-4 z-50 rounded-t-3xl"
        style={{
          background: "linear-gradient(to top, rgba(13,15,26,0.98) 70%, transparent 100%)",
          backdropFilter: "blur(10px)"
        }}
      >
        {/* Dots indicator */}
        <div className="flex gap-2">
          {[1, 2, 3].map(dot => (
            <div key={dot} className={`h-1.5 rounded-full transition-all duration-300 ${currentStep === dot ? "w-6 bg-[#a78bfa]" : "w-1.5 bg-white/10"}`} />
          ))}
        </div>

        <div className="flex w-full gap-3">
          {currentStep > 1 && (
            <button 
              onClick={prevStep}
              className="px-6 rounded-2xl border border-white/10 text-white font-bold transition-all active:scale-95"
            >
              ←
            </button>
          )}
          <button
            onClick={currentStep === 3 ? undefined : nextStep}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-bold text-white transition-all active:scale-95 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
              boxShadow: "0 8px 32px rgba(124,58,237,0.4)"
            }}
          >
            {currentStep === 3 ? "บันทึกข้อมูลผู้ป่วย" : "ถัดไป →"}
          </button>
        </div>
      </div>
      
    </div>
  )
}
