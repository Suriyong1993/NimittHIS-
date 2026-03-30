"use client"

import { useState } from "react"
import Link from "next/link"

const ENTRIES = [
  { id: "1", date: "30 มี.ค.", time: "10:30 น.", mood: "😊", title: "วันนี้รู้สึกสดชื่นมาก", preview: "วันนี้ได้ตื่นมาสูดอากาศบริสุทธิ์และจัดระเบียบความคิดตัวเองได้ดีขึ้นมาก มีความสุขกับการทำงาน...", tags: ["มีแรง", "สงบ"], color: "#fbbf24" },
  { id: "2", date: "28 มี.ค.", time: "21:15 น.", mood: "😔", title: "เหนื่อยจากการคุยกับคนรอบข้าง", preview: "บางครั้งก็รู้สึกว่าความคาดหวังของคนอื่นมันหนักเกินไปสำหรับเราในตอนนี้ พยายามจะเข้มแข็งแต่ก็...", tags: ["เหนื่อย", "เศร้า"], color: "#f97316" },
  { id: "3", date: "25 มี.ค.", time: "09:00 น.", mood: "🙂", title: "เริ่มกลับมาอ่านหนังสือได้แล้ว", preview: "สมาธิดีขึ้นกว่าเมื่ออาทิตย์ที่แล้ว อ่านหนังสือได้จบ 1 บทโดยที่ไม่ต้องพัก รู้สึกภูมิใจในตัวเอง...", tags: ["สงบ"], color: "#34d399" },
]

const MONTHS = ["มี.ค.", "ก.พ.", "ม.ค.", "ธ.ค.", "พ.ย.", "ต.ค."]

export function MoodJournalPage() {
  const [currentPage, setCurrentPage] = useState<"list" | "new">("list")
  const [activeMonth, setActiveMonth] = useState("มี.ค.")

  // Render List View
  if (currentPage === "list") {
    return (
      <div className="mx-auto w-full max-w-[390px] min-h-screen pb-32 overflow-x-hidden" style={{ background: "#0d0f1a" }}>
        
        {/* ── Top Bar ── */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-5 pt-12 pb-4" style={{ background: "rgba(13,15,26,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(167,139,250,0.2)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </Link>
            <h1 className="text-[17px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>ไดอารี่ของฉัน</h1>
          </div>
          
          <button 
            onClick={() => setCurrentPage("new")}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95 shadow-lg" 
            style={{ background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)", boxShadow: "0 4px 12px rgba(124,58,237,0.4)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </header>

        <main className="flex flex-col gap-6 px-5 mt-4">
          
          {/* ── Month Filter ── */}
          <section className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide animate-fade-in">
            {MONTHS.map((month) => (
              <button
                key={month}
                onClick={() => setActiveMonth(month)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${activeMonth === month ? "text-white" : "text-[#64748b]"}`}
                style={{
                  background: activeMonth === month ? "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)" : "rgba(255,255,255,0.03)",
                  boxShadow: activeMonth === month ? "0 4px 15px rgba(167,139,250,0.3)" : "none"
                }}
              >
                {month}
              </button>
            ))}
          </section>

          {/* ── Entry List ── */}
          <section className="flex flex-col gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
            {ENTRIES.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-24 w-24 items-center justify-center mb-6 opacity-30">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path><path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">เริ่มบันทึกความรู้สึกแรก</h3>
                <p className="text-xs text-[#64748b] italic mb-6">"การเขียนคือการปลดปล่อยความคิด และเป็นก้าวแรกของการเยียวยา..."</p>
                <button 
                  onClick={() => setCurrentPage("new")}
                  className="rounded-2xl px-8 py-3 text-sm font-bold text-white" 
                  style={{ background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)" }}
                >
                  เขียนเลย
                </button>
              </div>
            ) : (
              ENTRIES.map((entry, i) => (
                <div 
                  key={entry.id} 
                  className="relative flex flex-col gap-3 rounded-[24px] p-5 transition-transform active:scale-98"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(167,139,250,0.12)",
                    animationDelay: `${i * 100}ms`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-bold text-white tracking-widest">{entry.date}</span>
                      <div className="h-7 w-7 flex items-center justify-center rounded-full text-sm" style={{ background: `${entry.color}15`, border: `1px solid ${entry.color}40`, boxShadow: `0 0 10px ${entry.color}20` }}>
                        {entry.mood}
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-[#475569]">{entry.time}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-[16px] font-bold text-white truncate">{entry.title}</h3>
                    <p className="text-[13px] text-[#94a3b8] mt-1.5 leading-relaxed truncate-2-lines line-clamp-2">
                       {entry.preview}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                    <div className="flex gap-2">
                      {entry.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-white/5 text-[#a78bfa] border border-[#a78bfa]/20 uppercase">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="text-[11px] font-bold text-[#2dd4bf] hover:opacity-80 transition-opacity">อ่านต่อ</button>
                      <button className="h-7 w-7 flex items-center justify-center rounded-lg text-[#f43f5e] hover:bg-[#f43f5e]/10 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        </main>
        
        <style>{`
          .truncate-2-lines {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    )
  }

  // Render New Entry Screen
  return (
    <div className="mx-auto w-full max-w-[390px] h-screen overflow-hidden flex flex-col" style={{ background: "#0d0f1a" }}>
      
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4">
        <button onClick={() => setCurrentPage("list")} className="text-sm font-bold text-[#64748b] hover:text-white transition-colors">ย้อนกลับ</button>
        <span className="text-[14px] font-bold text-[#2dd4bf] font-mono tracking-widest uppercase">30 มีนาคม 2569</span>
        <button onClick={() => setCurrentPage("list")} className="text-sm font-bold text-[#a78bfa] hover:text-[#c4b5fd] transition-colors">เสร็จสิ้น</button>
      </header>

      {/* ── Content Area ── */}
      <main className="flex-1 flex flex-col px-5 pt-4 overflow-y-auto animate-fade-in">
        
        {/* Mood select quick picker */}
        <div className="flex justify-between items-center px-4 py-3 rounded-2xl bg-white/3 border border-white/5 mb-6">
          {["😊", "🙂", "😐", "😔", "😢"].map(m => (
            <button key={m} className={`text-2xl transition-all duration-300 hover:scale-125 ${m === "😊" ? "opacity-100" : "opacity-30"}`}>{m}</button>
          ))}
        </div>

        <input 
          type="text" 
          placeholder="วันนี้ฉันอยากเล่าว่า..." 
          className="w-full text-2xl font-bold text-white placeholder-white/20 bg-transparent focus:outline-none mb-6 caret-[#a78bfa]" 
          autoFocus
        />
        
        <textarea 
          placeholder="เล่าความรู้สึก หรือสิ่งที่เกิดขึ้นในวันนี้ลงไปได้เลย..."
          className="w-full flex-1 text-[16px] text-[#f1f5f9] placeholder-[#94a3b8]/40 bg-transparent focus:outline-none resize-none leading-relaxed caret-[#a78bfa]"
        />
      </main>

      {/* ── Bottom Toolbar ── */}
      <div 
        className="w-full px-5 py-6 flex items-center justify-between border-t border-white/5"
        style={{ background: "rgba(13,15,26,0.95)", backdropFilter: "blur(10px)" }}
      >
        <div className="flex gap-4">
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-[#a78bfa] transition-transform active:scale-90">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.5 1.5"></path><path d="M7.6 7.6L2 2"></path></svg>
          </button>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-[#2dd4bf] transition-transform active:scale-90">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </button>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-[#fbbf24] transition-transform active:scale-90">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"></line></svg>
          </button>
        </div>

        <button 
          onClick={() => setCurrentPage("list")}
          className="rounded-2xl px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-transform active:scale-95" 
          style={{ background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)", boxShadow: "0 8px 24px rgba(124,58,237,0.4)" }}
        >
          ✅ บันทึก
        </button>
      </div>
    </div>
  )
}
