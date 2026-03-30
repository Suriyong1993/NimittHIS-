"use client"

import { useState } from "react"
import Link from "next/link"

const MOODS = [
  { id: "1", emoji: "😢", label: "แย่มาก", color: "#f43f5e" },
  { id: "2", emoji: "😔", label: "ไม่ดี", color: "#f97316" },
  { id: "3", emoji: "😐", label: "ปานกลาง", color: "#60a5fa" },
  { id: "4", emoji: "🙂", label: "ดี", color: "#34d399" },
  { id: "5", emoji: "😊", label: "ดีมาก", color: "#fbbf24" },
]

const EMOTION_TAGS = [
  { id: "anxious", icon: "😰", label: "วิตกกังวล", color: "#f43f5e" },
  { id: "tired", icon: "😴", label: "เหนื่อย", color: "#60a5fa" },
  { id: "irritable", icon: "😤", label: "หงุดหงิด", color: "#f97316" },
  { id: "overthinking", icon: "💭", label: "ครุ่นคิดมาก", color: "#c4b5fd" },
  { id: "sad", icon: "😢", label: "เศร้า", color: "#60a5fa" },
  { id: "numb", icon: "😐", label: "ชา", color: "#94a3b8" },
  { id: "overwhelmed", icon: "🤯", label: "ล้นหลาม", color: "#f43f5e" },
  { id: "energetic", icon: "💪", label: "มีแรง", color: "#10b981" },
  { id: "calm", icon: "😌", label: "สงบ", color: "#2dd4bf" },
  { id: "happy", icon: "🥰", label: "มีความสุข", color: "#fbbf24" },
]

export function MoodLoggingPage() {
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>("3")
  const [intensity, setIntensity] = useState(5)
  const [selectedTags, setSelectedTags] = useState<string[]>(["calm"])
  const [sleepHours, setSleepHours] = useState(8)
  const [hasExercise, setHasExercise] = useState(true)
  const [isPrivate, setIsPrivate] = useState(false)

  const toggleTag = (id: string) => {
    if (selectedTags.includes(id)) {
      setSelectedTags(selectedTags.filter(tagId => tagId !== id))
    } else {
      setSelectedTags([...selectedTags, id])
    }
  }

  const selectedMood = MOODS.find(m => m.id === selectedMoodId)

  return (
    <div className="mx-auto w-full max-w-[390px] min-h-screen pb-40 overflow-x-hidden" style={{ background: "#0d0f1a" }}>
      
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 pt-12 pb-4" style={{ background: "rgba(13,15,26,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(167,139,250,0.2)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </Link>
          <h1 className="text-[17px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>บันทึกอารมณ์วันนี้</h1>
        </div>
        <div className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#2dd4bf] border border-[#2dd4bf]/30 bg-[#2dd4bf]/10">
          30 มี.ค. 2569
        </div>
      </header>

      <main className="px-5 mt-8 flex flex-col gap-10">
        
        {/* ── Hero Question ── */}
        <section className="text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-1.5 leading-tight">วันนี้คุณรู้สึกอย่างไรบ้าง?</h2>
          <p className="text-[13px] text-[#94a3b8]">บอกเราเพื่อติดตามสุขภาพจิตของคุณ</p>
        </section>

        {/* ── Mood Selector ── */}
        <section className="flex justify-between items-end px-2 animate-slide-up" style={{ animationDelay: "100ms" }}>
          {MOODS.map((mood) => {
            const isSelected = selectedMoodId === mood.id
            return (
              <button
                key={mood.id}
                onClick={() => setSelectedMoodId(mood.id)}
                className="flex flex-col items-center gap-2 group outline-none"
              >
                <div 
                  className={`h-14 w-14 flex items-center justify-center rounded-full text-3xl transition-all duration-500 ${isSelected ? "scale-125 -translate-y-2 shadow-2xl" : "opacity-40 grayscale-0 hover:opacity-100"}`}
                  style={{ 
                    background: isSelected ? `${mood.color}15` : "transparent",
                    border: isSelected ? `2px solid ${mood.color}` : "2px solid transparent",
                    boxShadow: isSelected ? `0 10px 25px ${mood.color}40, 0 0 40px ${mood.color}15` : ""
                  }}
                >
                  {mood.emoji}
                </div>
                <span className={`text-[10px] font-bold transition-all duration-300 ${isSelected ? "text-white opacity-100" : "text-[#475569] opacity-40 group-hover:opacity-100"}`}>
                  {mood.label}
                </span>
              </button>
            )
          })}
        </section>

        {/* ── Mood Intensity Slider ── */}
        {selectedMoodId && (
          <section className="flex flex-col gap-5 animate-fade-in">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-white flex items-center gap-2 group">
                ระดับความรุนแรง <span className="h-1 w-1 rounded-full bg-[#a78bfa] opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </label>
              <span className="font-mono text-lg font-bold" style={{ color: selectedMood?.color || "#a78bfa" }}>{intensity} <span className="text-[10px] text-[#475569] uppercase tracking-widest -ml-0.5">/ 10</span></span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-white/5 p-[1px]">
              <div 
                className="absolute inset-x-0 top-0 h-full rounded-full transition-all duration-300" 
                style={{ 
                  width: `${intensity * 10}%`, 
                  background: `linear-gradient(90deg, #a78bfa 0%, ${selectedMood?.color || "#7c3aed"} 100%)`,
                  boxShadow: `0 0 15px ${(selectedMood?.color || "#7c3aed") + "40"}`
                }} 
              />
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={intensity} 
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="absolute inset-x-0 -top-2 w-full h-6 opacity-0 cursor-pointer"
              />
              <div 
                className="absolute h-4 w-4 bg-white rounded-full shadow-lg border-2 border-[#0d0f1a] -translate-y-1/2 pointer-events-none transition-all duration-100" 
                style={{ left: `calc(${intensity * 10}% - 8px)`, top: "50%" }}
              />
            </div>
          </section>
        )}

        {/* ── Emotion Tags ── */}
        <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <h3 className="text-sm font-bold text-white mb-4 pl-1">คุณรู้สึกอะไรอยู่บ้างในตอนนี้?</h3>
          <div className="flex flex-wrap gap-2.5">
            {EMOTION_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag.id)
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all border duration-300 active:scale-95`}
                  style={{
                    background: isSelected ? `${tag.color}15` : "rgba(255,255,255,0.03)",
                    borderColor: isSelected ? tag.color : "rgba(167,139,250,0.15)",
                    color: isSelected ? "#f1f5f9" : "#64748b",
                    boxShadow: isSelected ? `0 5px 15px ${tag.color}25` : "none"
                  }}
                >
                  <span className={`${isSelected ? "grayscale-0" : "grayscale"}`}>{tag.icon}</span>
                  {tag.label}
                </button>
              )
            })}
          </div>
        </section>

        {/* ── Notes ── */}
        <section className="animate-slide-up" style={{ animationDelay: "300ms" }}>
          <label className="text-sm font-bold text-white mb-3 block pl-1">เพิ่มบันทึกความรู้สึก (ไม่บังคับ)</label>
          <textarea
            placeholder="เล่าให้เราฟังว่าวันนี้เป็นอย่างไร..."
            className="w-full rounded-2xl p-4 text-sm text-white focus:outline-none transition-all duration-300 min-h-[120px]"
            style={{ 
              background: "rgba(255,255,255,0.03)", 
              border: "1px solid rgba(167,139,250,0.15)",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
            }}
            onFocus={(e) => { e.target.style.borderColor = "#a78bfa"; e.target.style.background = "rgba(167,139,250,0.05)" }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(167,139,250,0.15)"; e.target.style.background = "rgba(255,255,255,0.03)" }}
          />
        </section>

        {/* ── Sleep + Activity ── */}
        <section className="flex gap-3 mb-4 animate-slide-up" style={{ animationDelay: "400ms" }}>
          <div className="flex-1 rounded-3xl p-4 flex flex-col gap-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.1)" }}>
            <div className="flex justify-between items-center">
              <span className="text-lg">🌙</span>
              <span className="text-[10px] font-bold text-[#2dd4bf] uppercase tracking-widest">นอนหลับ</span>
            </div>
            <div className="flex flex-col gap-1.5 px-1">
              <span className="text-xl font-bold font-mono text-white leading-none">{sleepHours} <span className="text-[10px] text-[#64748b]">ชม.</span></span>
              <input 
                type="range" 
                min="0" 
                max="12" 
                value={sleepHours} 
                onChange={(e) => setSleepHours(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-[#2dd4bf]"
              />
            </div>
          </div>

          <div className="flex-1 rounded-3xl p-4 flex flex-col gap-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.1)" }}>
            <div className="flex justify-between items-center text-lg">
              <span>🏃</span>
              <span className="text-[10px] font-bold text-[#fbbf24] uppercase tracking-widest">ออกกำลังกาย</span>
            </div>
            <div className="flex items-center justify-between mt-1 px-1">
              <span className={`text-[12px] font-bold ${hasExercise ? "text-[#fbbf24]" : "text-[#475569]"}`}>{hasExercise ? "30 นาที" : "ไม่ได้ทำ"}</span>
              <div 
                onClick={() => setHasExercise(!hasExercise)}
                className={`w-10 h-5 rounded-full relative p-1 transition-all duration-300 cursor-pointer ${hasExercise ? "bg-[#fbbf24]" : "bg-[#475569]"}`}
              >
                <div className={`h-3 w-3 bg-white rounded-full transition-transform duration-300 ${hasExercise ? "translate-x-5" : "translate-x-0"}`} />
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Bottom Buttons ── */}
      <div 
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-5 py-6 flex flex-col items-center gap-3 z-50 rounded-t-3xl"
        style={{
          background: "linear-gradient(to top, rgba(13,15,26,0.98) 70%, transparent 100%)",
          backdropFilter: "blur(10px)"
        }}
      >
        <button
          className="w-full rounded-2xl py-4 text-[15px] font-bold text-white transition-all active:scale-95 shadow-lg"
          style={{
            background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
            boxShadow: "0 8px 32px rgba(124,58,237,0.4)"
          }}
        >
          บันทึกอารมณ์
        </button>

        <button 
          onClick={() => setIsPrivate(!isPrivate)}
          className="flex items-center gap-2 text-[11px] font-bold transition-colors duration-300"
          style={{ color: isPrivate ? "#2dd4bf" : "#64748b" }}
        >
          {isPrivate ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          )}
          {isPrivate ? "บันทึกเป็นส่วนตัวอยู่" : "บันทึกเป็นส่วนตัว (แพทย์ยังเห็นข้อมูล)"}
        </button>
      </div>

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          border: 2px solid #0d0f1a;
        }
      `}</style>
    </div>
  )
}
