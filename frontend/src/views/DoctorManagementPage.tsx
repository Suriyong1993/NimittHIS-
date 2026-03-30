"use client"

import { useState } from "react"
import Link from "next/link"

interface Doctor {
  id: string
  name: string
  specialty: string
  patientCount: number
  status: "active" | "inactive"
  photo: string
}

const DOCTORS: Doctor[] = [
  { id: "1", name: "นพ.วิชัย สมบูรณ์", specialty: "จิตแพทย์", patientCount: 24, status: "active", photo: "https://i.pravatar.cc/150?u=doc1" },
  { id: "2", name: "พญ.อรัญญา ใจดี", specialty: "จิตแพทย์", patientCount: 18, status: "active", photo: "https://i.pravatar.cc/150?u=doc2" },
  { id: "3", name: "ดร.สมชาย รักการ", specialty: "นักจิตวิทยา", patientCount: 12, status: "inactive", photo: "https://i.pravatar.cc/150?u=doc3" },
  { id: "4", name: "นางวารี สุขใจ", specialty: "นักสังคมสงเคราะห์", patientCount: 8, status: "active", photo: "https://i.pravatar.cc/150?u=doc4" },
]

export function DoctorManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("ทุกสาขา")
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  const filteredDoctors = DOCTORS.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === "ทุกสาขา" || doc.specialty === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="mx-auto w-full max-w-[390px] min-h-screen pb-32 overflow-hidden" style={{ background: "#0d0f1a" }}>
      
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 pt-12 pb-4" style={{ background: "rgba(13,15,26,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(167,139,250,0.2)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </Link>
          <h1 className="text-[17px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>จัดการแพทย์</h1>
        </div>
        
        <button className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95 shadow-lg" style={{ background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)", boxShadow: "0 4px 12px rgba(124,58,237,0.4)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </header>

      <main className="flex flex-col gap-5 px-5 mt-4">
        
        {/* ── Search + Filter Bar ── */}
        <section className="flex flex-col gap-3 animate-slide-up">
          <div className="relative">
            <input 
              type="text" 
              placeholder="ค้นหาชื่อแพทย์..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(167,139,250,0.15)",
                fontFamily: "'Sarabun', sans-serif",
              }}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {["ทุกสาขา", "จิตแพทย์", "นักจิตวิทยา", "นักสังคมสงเคราะห์"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all ${filter === cat ? "text-white" : "text-[#64748b]"}`}
                style={{
                  background: filter === cat ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.03)",
                  border: filter === cat ? "1px solid rgba(167,139,250,0.4)" : "1px solid transparent",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* ── Doctor List ── */}
        <section className="flex flex-col gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
          {filteredDoctors.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 mb-4 opacity-20">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">ไม่พบแพทย์</h3>
              <button className="rounded-xl px-6 py-2.5 text-sm font-bold text-white mt-2" style={{ background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)" }}>เพิ่มแพทย์คนแรก</button>
            </div>
          ) : (
            filteredDoctors.map((doc, i) => (
              <div 
                key={doc.id} 
                className="relative flex flex-col gap-4 rounded-2xl p-4 transition-transform active:scale-98"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(167,139,250,0.12)",
                  animationDelay: `${i * 50}ms`
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={doc.photo} alt={doc.name} className="h-14 w-14 rounded-full object-cover border-2 border-white/5" />
                    <div 
                      className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-[#0d0f1a]"
                      style={{ background: doc.status === "active" ? "#10b981" : "#f43f5e" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold text-white truncate">{doc.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ background: "rgba(167,139,250,0.12)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.2)" }}>{doc.specialty}</span>
                      <span className="text-[10px] text-[#2dd4bf] font-mono">ผู้ป่วย {doc.patientCount} คน</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveMenuId(activeMenuId === doc.id ? null : doc.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#64748b] transition-colors hover:bg-white/5"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                  </button>
                </div>

                {/* Context Menu Overlay */}
                {activeMenuId === doc.id && (
                  <div className="absolute right-4 top-12 z-10 w-44 rounded-2xl p-2 shadow-2xl animate-fade-in" style={{ background: "rgba(20, 24, 40, 0.95)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-white hover:bg-white/5">
                      <span>✏️</span> แก้ไขข้อมูล
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-white hover:bg-white/5">
                      <span>📅</span> ดูนัดหมาย
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-white hover:bg-white/5">
                      <span>🔒</span> ระงับบัญชี
                    </button>
                    <div className="my-1 h-[1px] bg-white/5" />
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-[#f43f5e] hover:bg-[#f43f5e]/10">
                      <span>🗑️</span> ลบบัญชี
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${doc.status === "active" ? "bg-[#10b981]/15 text-[#10b981]" : "bg-[#f43f5e]/15 text-[#f43f5e]"}`}>
                    {doc.status === "active" ? "เปิดใช้งาน" : "ปิดการใช้งาน"}
                  </span>
                  <div className="flex gap-2">
                    <button className="rounded-xl px-4 py-1.5 text-xs font-bold transition-all" style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.3)", color: "#a78bfa" }}>
                      แก้ไข
                    </button>
                    <button className="rounded-xl px-4 py-1.5 text-xs font-bold transition-all text-[#f43f5e] hover:bg-[#f43f5e]/5">
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* ── Floating Action Button ── */}
      <div className="fixed bottom-8 right-6 z-50 flex flex-col items-end group">
        <button 
          className="flex h-14 w-14 items-center justify-center rounded-full shadow-[0_8px_32px_rgba(124,58,237,0.5)] transition-all active:scale-90 group-hover:w-auto group-hover:px-6"
          style={{ background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)" }}
        >
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span className="hidden group-hover:block whitespace-nowrap text-white font-bold text-sm">เพิ่มแพทย์</span>
          </div>
        </button>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
