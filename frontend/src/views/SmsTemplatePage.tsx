"use client"

import { useState } from "react"
import Link from "next/link"

const TEMPLATES = [
  {
    id: "gentle",
    title: "แจ้งเตือนอ่อนๆ",
    content: (name: string) => `สวัสดีครับ/ค่ะ คุณ${name}\nเราสังเกตว่าท่านไม่ได้มาตามนัดวันนี้หากมีปัญหาหรือต้องการความช่วยเหลือ โทรกลับ 02-xxx-xxxx ได้เลยนะครับ/ค่ะ\n— ทีมดูแล MindCare`
  },
  {
    id: "reschedule",
    title: "ขอนัดใหม่",
    content: (name: string) => `สวัสดีครับ/ค่ะ คุณ${name}\nขอนัดหมายใหม่กับ นพ.วิชัย ได้ที่ nimitthis.app/book หรือโทร 02-xxx-xxxx`
  },
  {
    id: "emergency",
    title: "ฉุกเฉิน / เสี่ยงสูง",
    content: (name: string) => `สวัสดีครับ/ค่ะ คุณ${name}\nเราเป็นห่วงสุขภาพของท่านมากหากรู้สึกไม่ดี โทรสายด่วนสุขภาพจิต 1323 ได้ตลอด 24 ชั่วโมง หรือโทรหาเราที่ 02-xxx-xxxx ได้เลย`,
    isEmergency: true
  }
]

export function SmsTemplatePage() {
  const patientName = "นายสมชาย วีระกุล"
  const [selectedId, setSelectedId] = useState("gentle")
  const [isEditing, setIsEditing] = useState(false)
  const [customText, setCustomText] = useState("")

  const selectedTemplate = TEMPLATES.find(t => t.id === selectedId)
  const currentMessage = isEditing && customText ? customText : selectedTemplate?.content(patientName) || ""

  return (
    <div className="mx-auto w-full max-w-[390px] min-h-screen pb-32 overflow-x-hidden" style={{ background: "#0d0f1a" }}>
      
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 flex items-center gap-4 px-5 pt-12 pb-4" style={{ background: "rgba(13,15,26,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <Link href="/admin/noshow" className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(167,139,250,0.2)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </Link>
        <h1 className="text-[18px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>เลือกข้อความที่จะส่ง</h1>
      </header>

      <main className="px-5 mt-6 flex flex-col gap-6">
        
        {/* ── Patient Info Bar ── */}
        <section className="flex items-center gap-4 p-4 rounded-2xl animate-fade-in" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.1)" }}>
          <img src="https://i.pravatar.cc/150?u=noshow1" alt="patient avatar" className="h-10 w-10 rounded-full border-2 border-white/5 shadow-lg" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-wide">{patientName}</span>
            <span className="text-[11px] font-mono font-bold text-[#2dd4bf] uppercase tracking-widest mt-0.5">📞 081-xxx-xxxx</span>
          </div>
        </section>

        {/* ── Template List ── */}
        <section className="flex flex-col gap-4 animate-slide-up">
           {TEMPLATES.map((t, i) => {
             const isSelected = selectedId === t.id
             return (
               <button 
                 key={t.id}
                 onClick={() => { setSelectedId(t.id); setIsEditing(false) }}
                 className="relative flex flex-col gap-3 rounded-3xl p-5 text-left transition-all duration-300"
                 style={{
                   background: isSelected ? "rgba(167,139,250,0.08)" : "rgba(255,255,255,0.03)",
                   border: isSelected 
                    ? `1.5px solid ${t.isEmergency ? "#f43f5e" : "#a78bfa"}` 
                    : "1.5px solid rgba(167,139,250,0.15)",
                   boxShadow: isSelected ? `0 10px 25px rgba(167,139,250,0.1)` : "none",
                   animationDelay: `${i * 100}ms`
                 }}
               >
                 <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold uppercase tracking-widest ${t.isEmergency ? "text-[#f43f5e]" : "text-[#a78bfa]"}`}>{t.title}</span>
                    {isSelected && (
                      <div className={`h-5 w-5 flex items-center justify-center rounded-full ${t.isEmergency ? "bg-[#f43f5e]" : "bg-[#a78bfa] dark-glow"}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                    )}
                 </div>
                 <p className="text-[13px] text-[#94a3b8] leading-relaxed whitespace-pre-line pr-2">{t.content(patientName)}</p>
               </button>
             )
           })}
        </section>

        {/* ── Edit Area ── */}
        <section className="mt-2 animate-slide-up" style={{ animationDelay: "300ms" }}>
           <div className="flex items-center justify-between mb-3 px-1">
              <label className="text-xs font-bold text-[#64748b] uppercase tracking-widest flex items-center gap-2">
                ✍️ ปรับแก้ข้อความ
              </label>
              <div 
                onClick={() => { setIsEditing(!isEditing); if(!isEditing) setCustomText(currentMessage) }}
                className={`w-9 h-5 rounded-full relative p-1 transition-all duration-300 cursor-pointer ${isEditing ? "bg-[#a78bfa]" : "bg-[#475569]"}`}
              >
                <div className={`h-3 w-3 bg-white rounded-full transition-transform duration-300 ${isEditing ? "translate-x-4" : "translate-x-0"}`} />
              </div>
           </div>

           {isEditing && (
             <div className="relative animate-fade-in">
               <textarea 
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full rounded-2xl p-4 text-[13px] text-[#f1f5f9] leading-relaxed focus:outline-none min-h-[140px] resize-none"
                  style={{
                    background: "rgba(167,139,250,0.05)",
                    border: "1.5px solid rgba(167,139,250,0.3)"
                  }}
                  placeholder="พิมพ์ข้อความที่ต้องการส่ง..."
               />
               <div className="absolute bottom-3 right-4 font-mono text-[10px] text-[#64748b] tracking-wider">
                 {currentMessage.length} / 160 ตัวอักษร
               </div>
             </div>
           )}
        </section>

      </main>

      {/* ── Bottom Buttons ── */}
      <div 
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-5 py-8 flex flex-col gap-4 z-50 rounded-t-3xl"
        style={{
          background: "linear-gradient(to top, rgba(13,15,26,1) 80%, transparent 100%)",
          backdropFilter: "blur(10px)"
        }}
      >
        <div className="flex items-center justify-between px-2 text-[10px] font-bold text-[#64748b] uppercase tracking-widest">
           <span>Preview Mode</span>
           <span className="text-[#a78bfa]">On</span>
        </div>
        
        <button
          className="w-full relative flex items-center justify-center gap-3 rounded-2xl py-4 text-[15px] font-bold text-white transition-all active:scale-95 shadow-lg overflow-hidden group"
          style={{
            background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)"
          }}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          ส่ง SMS แจ้งเตือน
        </button>
      </div>

    </div>
  )
}
