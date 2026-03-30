"use client"

import Link from "next/link"
import { useState } from "react"

const APPOINTMENT_TYPES = [
  { id: "clinic", icon: "🏥", label: "พบที่ห้องตรวจ", duration: "50 นาที" },
  { id: "video", icon: "📱", label: "ปรึกษาออนไลน์", duration: "50 นาที" },
  { id: "audio", icon: "📞", label: "ปรึกษาทางโทรศัพท์", duration: "30 นาที" }
]

const TIME_SLOTS = [
  { time: "09:00", available: true },
  { time: "10:00", available: false },
  { time: "11:00", available: true },
  { time: "13:00", available: true },
  { time: "14:00", available: true },
  { time: "15:00", available: false },
]

export function AppointmentBookingPage() {
  const [selectedType, setSelectedType] = useState("clinic")
  const [selectedDate, setSelectedDate] = useState<number | null>(14) // default to 14th
  const [selectedTime, setSelectedTime] = useState<string | null>("11:00") // default to 11:00

  return (
    <div className="mx-auto w-full max-w-[390px] min-h-screen pb-36" style={{ background: "#0d0f1a" }}>
      
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 pt-12 pb-4" style={{ background: "rgba(13,15,26,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <Link href="/dashboard" className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(167,139,250,0.2)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </Link>
        <h1 className="text-[17px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>นัดหมายจิตแพทย์</h1>
        <div className="w-10" /> {/* Empty div to balance header */}
      </header>

      <main className="flex flex-col gap-7 px-5 mt-4">

        {/* ── Doctor Card ── */}
        <section className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: "50ms" }}>
          <div className="relative">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026703d" alt="Doctor avatar" className="h-[72px] w-[72px] rounded-full object-cover" />
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#10b981] ring-2 ring-[#0d0f1a]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>นพ.วิชัย สมบูรณ์</h2>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)" }}>จิตแพทย์</span>
              <span className="flex items-center gap-1 text-[11px] text-[#94a3b8] font-medium font-mono">
                <span className="text-[#fbbf24] text-[12px]">⭐</span> 4.9 <span className="text-[#475569] px-1">•</span> ผู้ป่วย 200+ คน
              </span>
            </div>
          </div>
        </section>

        {/* ── Appointment Type ── */}
        <section className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <h3 className="mb-3 text-[15px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>ประเภทการพบ</h3>
          <div className="grid grid-cols-3 gap-3">
            {APPOINTMENT_TYPES.map(type => {
              const isActive = selectedType === type.id
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className="relative flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-all duration-200 active:scale-95"
                  style={{
                    background: isActive ? "linear-gradient(180deg, rgba(167,139,250,0.08) 0%, rgba(255,255,255,0.01) 100%)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? "rgba(167,139,250,0.5)" : "rgba(167,139,250,0.15)"}`,
                    boxShadow: isActive ? "0 4px 20px rgba(167,139,250,0.2)" : "none",
                  }}
                >
                  <span className="text-2xl drop-shadow-lg">{type.icon}</span>
                  <span className={`text-[11px] font-bold mt-1 ${isActive ? "text-[#f1f5f9]" : "text-[#94a3b8]"}`}>{type.label}</span>
                  <span className="text-[10px] text-[#2dd4bf] font-mono mt-0.5">{type.duration}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── Calendar Picker ── */}
        <section className="animate-slide-up" style={{ animationDelay: "150ms" }}>
          <div className="rounded-3xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.15)", boxShadow: "0 10px 40px rgba(13,15,26,0.3)" }}>
            
            {/* Month Header */}
            <div className="flex items-center justify-between mb-5">
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-[#94a3b8]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <h3 className="text-[16px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>มีนาคม 2569</h3>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>

            {/* Days row */}
            <div className="grid grid-cols-7 gap-1 mb-3 text-center text-[11px] font-bold text-[#64748b]">
              <div>อา</div><div>จ</div><div>อ</div><div>พ</div><div>พฤ</div><div>ศ</div><div>ส</div>
            </div>

            {/* Dates Grid (Dummy month for design demo) */}
            <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center font-mono text-[13px]">
              {/* Empty padding days */}
              <div/><div/>
              {/* Days 1-14 */}
              {[...Array(14)].map((_, i) => {
                const date = i + 1
                const isAvailable = date % 3 !== 0 // some logic for styling
                const isSelected = selectedDate === date
                const isToday = date === 1

                let dayStyle = {}
                let textStyle = "text-[#f1f5f9]"

                // Custom styling per state
                if (isSelected) {
                  dayStyle = { background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)", boxShadow: "0 0 16px rgba(167,139,250,0.4)", color: "#fff", fontWeight: "bold" }
                } else if (!isAvailable) {
                  textStyle = "text-[#475569] line-through decoration-[#475569]/50"
                  dayStyle = { pointerEvents: "none" }
                } else if (isToday) {
                  dayStyle = { background: "rgba(45,212,191,0.1)", border: "1px solid #2dd4bf", color: "#2dd4bf", fontWeight: "bold" }
                }

                return (
                  <div key={date} className="flex justify-center">
                    <button
                      onClick={() => isAvailable && setSelectedDate(date)}
                      className={`flex h-[34px] w-[34px] items-center justify-center rounded-full transition-all active:scale-95 ${textStyle}`}
                      style={dayStyle}
                    >
                      {date}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Time Slots ── */}
        <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <h3 className="mb-3 text-[15px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>เลือกเวลา</h3>
          <div className="grid grid-cols-3 gap-3">
            {TIME_SLOTS.map(slot => {
              const isSelected = selectedTime === slot.time
              
              if (!slot.available) {
                return (
                  <div key={slot.time} className="flex h-11 items-center justify-center rounded-xl opacity-60 pointer-events-none" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <span className="font-mono text-sm text-[#475569] line-through decoration-[#475569]">{slot.time}</span>
                  </div>
                )
              }

              return (
                <button
                  key={slot.time}
                  onClick={() => setSelectedTime(slot.time)}
                  className="flex h-11 items-center justify-center rounded-xl transition-all duration-200 active:scale-95"
                  style={{
                    background: isSelected ? "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isSelected ? "transparent" : "rgba(167,139,250,0.25)"}`,
                    boxShadow: isSelected ? "0 4px 16px rgba(167,139,250,0.3)" : "none",
                  }}
                >
                  <span className={`font-mono text-sm font-bold ${isSelected ? "text-white" : "text-[#f1f5f9]"}`}>{slot.time}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── Reason Input ── */}
        <section className="animate-slide-up" style={{ animationDelay: "250ms" }}>
          <h3 className="mb-2.5 text-[13px] font-bold text-[#f1f5f9]" style={{ fontFamily: "'Sarabun', sans-serif" }}>เหตุผลในการพบ (ไม่บังคับ)</h3>
          <textarea
            className="w-full rounded-2xl p-4 text-sm text-white focus:outline-none transition-all duration-200 resize-none"
            placeholder="เช่น ต้องการปรับลดยา, มีอาการนอนไม่หลับเพิ่มขึ้น..."
            rows={3}
            style={{
               background: "rgba(255,255,255,0.04)",
               border: "1px solid rgba(167,139,250,0.2)",
               fontFamily: "'Sarabun', sans-serif",
            }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(167,139,250,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(167,139,250,0.1)"; e.target.style.background = "rgba(167,139,250,0.05)" }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(167,139,250,0.2)"; e.target.style.boxShadow = "none"; e.target.style.background = "rgba(255,255,255,0.04)" }}
          />
        </section>

      </main>

      {/* ── CTA Bottom Sticky ── */}
      <div 
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-5 py-6 flex flex-col items-center gap-2.5 z-50 rounded-t-3xl"
        style={{
          background: "linear-gradient(to top, rgba(13,15,26,0.98) 60%, transparent 100%)",
          backdropFilter: "blur(10px)"
        }}
      >
        <button
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-bold text-white transition-all active:scale-95 shadow-lg"
          style={{
            fontFamily: "'Sarabun', sans-serif",
            background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
            boxShadow: "0 8px 32px rgba(124,58,237,0.4)"
          }}
        >
          ยืนยันการนัดหมาย
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </button>
        <p className="text-[10px] font-bold text-[#2dd4bf] tracking-wide bg-[#2dd4bf]/10 px-3 py-1 rounded-full text-center">
          ฟรีสำหรับผู้ป่วยในระบบ
        </p>
      </div>
      
    </div>
  )
}
