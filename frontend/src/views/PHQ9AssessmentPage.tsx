"use client"

import { useState } from "react"
import Link from "next/link"

const QUESTIONS = [
  "เบื่อ ทำอะไรๆ ก็ไม่เพลิดเพลิน",
  "ไม่สบายใจ ซึมเศร้า หรือท้อแท้",
  "หลับยาก หรือหลับๆ ตื่นๆ หรือหลับมากเกินไป",
  "เหนื่อยง่าย หรือไม่ค่อยมีแรง",
  "เบื่ออาหาร หรือกินมากเกินไป",
  "รู้สึกไม่ดีกับตัวเอง คิดว่าตัวเองล้มเหลว หรือทำให้ตนเองหรือครอบครัวขายหน้า",
  "สมาธิไม่ดีเวลาทำอะไร เช่น ดูโทรทัศน์ ฟังวิทยุ หรือทำงานที่ต้องใช้ความตั้งใจ",
  "พูดหรือทำอะไรช้าจนคนอื่นสังเกตเห็นได้ หรือกระสับกระส่ายจนอยู่ไม่นิ่งเหมือนเคย",
  "คิดทำร้ายตนเอง หรือคิดว่าถ้าตายๆ ไปเสียคงจะดี"
]

const OPTIONS = [
  { label: "ไม่เลย", score: 0 },
  { label: "บางวัน (1-6 วัน)", score: 1 },
  { label: "บ่อยครั้ง (7-11 วัน)", score: 2 },
  { label: "เกือบทุกวัน", score: 3 }
]

export function PHQ9AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(0) // 0-8 for questions, 9 for result
  const [answers, setAnswers] = useState<number[]>(new Array(9).fill(-1))
  const [showResult, setShowResult] = useState(false)

  const handleSelect = (score: number) => {
    const newAnswers = [...answers]
    newAnswers[currentStep] = score
    setAnswers(newAnswers)
  }

  const nextStep = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowResult(true)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const totalScore = answers.reduce((acc, curr) => acc + (curr === -1 ? 0 : curr), 0)

  const getResultInfo = (score: number) => {
    if (score <= 4) return { label: "ไม่มีอาการ", color: "#10b981", text: "คุณมีสุขภาพจิตที่ดี แนะนำให้รักษาสุขภาพจิตต่อไป" }
    if (score <= 9) return { label: "อาการเล็กน้อย", color: "#2dd4bf", text: "แนะนำให้ติดตามอารมณ์ตนเอง และทำกิจกรรมที่ผ่อนคลาย" }
    if (score <= 14) return { label: "อาการปานกลาง", color: "#fb923c", text: "ควรปรึกษาจิตแพทย์เพื่อรับคำแนะนำเบื้องต้น" }
    if (score <= 19) return { label: "ค่อนข้างรุนแรง", color: "#f97316", text: "แนะนำให้นัดหมายแพทย์เพื่อประเมินอย่างละเอียดโดยเร็ว" }
    return { label: "อาการรุนแรง", color: "#f43f5e", text: "กรุณาติดต่อผู้ดูแลหรือหน่วยงานด่วน เพื่อรับความช่วยเหลือทันที" }
  }

  const result = getResultInfo(totalScore)

  if (showResult) {
    return (
      <div className="mx-auto w-full max-w-[390px] min-h-screen pb-32 overflow-x-hidden" style={{ background: "#0d0f1a" }}>
        {/* ── Result Top Bar ── */}
        <header className="px-5 pt-12 pb-8 text-center animate-fade-in">
          <h1 className="text-[20px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>ผลการประเมิน</h1>
        </header>

        <main className="px-5 flex flex-col gap-6 animate-slide-up">
          <section className="relative flex flex-col items-center rounded-3xl p-10 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.15)", boxShadow: "0 24px 64px rgba(13,15,26,0.5)" }}>
            {/* Score Circle */}
            <div className="relative mb-6 h-32 w-32 flex items-center justify-center rounded-full border-[6px]" style={{ borderColor: `${result.color}20`, boxShadow: `0 0 30px ${result.color}30` }}>
              <div 
                className="absolute inset-x-0 inset-y-0 rounded-full border-[6px]" 
                style={{ 
                  borderColor: result.color, 
                  borderRightColor: "transparent", 
                  borderBottomColor: "transparent",
                  transform: `rotate(${(totalScore / 27) * 360}deg)`
                }} 
              />
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold font-mono tracking-tighter" style={{ color: result.color }}>{totalScore}</span>
                <span className="text-[10px] text-[#475569] font-bold uppercase tracking-widest mt-1">/ 27 แต้ม</span>
              </div>
            </div>

            <span className="rounded-full px-4 py-1.5 text-[13px] font-bold mb-4" style={{ background: `${result.color}15`, color: result.color, border: `1px solid ${result.color}40` }}>
              ระดับ: {result.label}
            </span>
            
            <p className="text-[15px] font-medium text-[#f1f5f9] leading-relaxed px-2">
              {result.text}
            </p>
          </section>

          <div className="flex flex-col gap-3 mt-4">
            <button className="w-full rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)", boxShadow: "0 8px 24px rgba(124,58,237,0.4)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
              แชร์ผลให้แพทย์ผู้ดูแล
            </button>
            
            {totalScore >= 15 && (
              <button className="w-full rounded-2xl py-4 text-sm font-bold text-white transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-2" style={{ background: "rgba(244,63,94,0.15)", border: "1px solid rgba(244,63,94,0.4)", color: "#f43f5e" }}>
                <span>🆘</span> นัดหมายแพทย์ด่วน
              </button>
            )}

            <button onClick={() => setShowResult(false)} className="w-full py-3 text-sm font-bold text-[#2dd4bf] hover:opacity-80 transition-opacity">
              บันทึกผลเข้าระบบ
            </button>
            
            <Link href="/dashboard" className="w-full text-center py-2 text-xs font-bold text-[#64748b] hover:text-white transition-colors">ย้อนกลับไปหน้าหลัก</Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[390px] h-screen overflow-hidden flex flex-col" style={{ background: "#0d0f1a" }}>
      
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 flex flex-col" style={{ background: "rgba(13,15,26,0.95)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center justify-between px-5 pt-12 pb-4">
          <Link href="/dashboard" className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(167,139,250,0.2)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </Link>
          <h1 className="text-[17px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>แบบประเมิน PHQ-9</h1>
          <div className="rounded-full px-3 py-1 text-[11px] font-bold font-mono tracking-widest text-[#2dd4bf] border border-[#2dd4bf]/20 bg-[#2dd4bf]/10">
            {currentStep + 1}/9
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-0.5 w-full bg-white/5 overflow-hidden">
          <div 
            className="h-full bg-[#a78bfa] transition-all duration-500 rounded-r-full shadow-[0_0_8px_#a78bfa]" 
            style={{ width: `${((currentStep + 1) / 9) * 100}%` }} 
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center px-5 pb-24">
        
        {/* Question Area */}
        <div key={currentStep} className="animate-fade-in flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] font-bold text-[#2dd4bf] uppercase tracking-widest">// ข้อที่ {currentStep + 1}</span>
            <p className="text-[20px] font-bold text-white leading-[1.6] pr-4">
              {QUESTIONS[currentStep]} 
              <span className="text-[#64748b] text-base font-medium ml-1">ในช่วง 2 สัปดาห์ที่ผ่านมา</span>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {OPTIONS.map((opt) => {
              const isSelected = answers[currentStep] === opt.score
              return (
                <button
                  key={opt.score}
                  onClick={() => handleSelect(opt.score)}
                  className="relative flex items-center justify-between rounded-2xl p-4 transition-all duration-300 active:scale-98"
                  style={{
                    background: isSelected ? "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)" : "rgba(255,255,255,0.03)",
                    border: isSelected ? "1px solid transparent" : "1px solid rgba(167,139,250,0.15)",
                    boxShadow: isSelected ? "0 8px 24px rgba(124,58,237,0.3)" : "none"
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "bg-white border-transparent" : "border-white/10"}`}>
                      {isSelected && <div className="h-2 w-2 rounded-full bg-[#7c3aed]" />}
                    </div>
                    <span className={`text-[15px] font-bold transition-colors ${isSelected ? "text-white" : "text-[#94a3b8]"}`}>{opt.label}</span>
                  </div>
                  {isSelected && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </main>

      {/* ── Navigation Bottom Bar ── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-5 py-8 flex gap-4 z-50">
        {currentStep > 0 && (
          <button 
            onClick={prevStep}
            className="px-6 rounded-2xl text-sm font-bold text-[#64748b] hover:text-[#94a3b8] transition-colors"
          >
            ← ก่อนหน้า
          </button>
        )}
        <button
          onClick={nextStep}
          disabled={answers[currentStep] === -1}
          className={`flex-1 rounded-2xl py-4 text-[15px] font-bold text-white transition-all active:scale-95 shadow-lg ${answers[currentStep] === -1 ? "opacity-30 grayscale" : "opacity-100"}`}
          style={{
            background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
            boxShadow: answers[currentStep] !== -1 ? "0 8px 32px rgba(124,58,237,0.4)" : "none"
          }}
        >
          {currentStep === 8 ? "ดูผลการประเมิน" : "ถัดไป →"}
        </button>
      </div>

    </div>
  )
}
