"use client"

import { useState } from "react"
import Link from "next/link"

interface Patient {
  id: string
  hn: string
  name: string
  diagnosis: string
  lastSeen: string
  risk: "HIGH" | "MEDIUM" | "LOW"
}

const PATIENTS: Patient[] = [
  { id: "1", hn: "HN00142", name: "นายสมชาย วีระกุล", diagnosis: "โรคซึมเศร้า", lastSeen: "3 วันที่แล้ว", risk: "HIGH" },
  { id: "2", hn: "HN00155", name: "นางสาวมณี ใจดี", diagnosis: "โรควิตกกังวล", lastSeen: "5 วันที่แล้ว", risk: "MEDIUM" },
  { id: "3", hn: "HN00168", name: "นายวิชัย สุขสบาย", diagnosis: "PTSD", lastSeen: "1 สัปดาห์ที่แล้ว", risk: "LOW" },
  { id: "4", hn: "HN00172", name: "นางสาวศิริพร งามสง่า", diagnosis: "โรคซึมเศร้า", lastSeen: "2 วันที่แล้ว", risk: "HIGH" },
  { id: "5", hn: "HN00180", name: "นายธนาชัย รักเรียน", diagnosis: "Bipolar", lastSeen: "10 วันที่แล้ว", risk: "LOW" },
]

export function PatientManagementPage() {
  const [activeTab, setActiveTab] = useState("ทั้งหมด")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const TABS = ["ทั้งหมด", "เสี่ยงสูง", "ติดตาม", "ไม่มาตามนัด"]

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const filteredPatients = PATIENTS.filter(p => {
    const matchesSearch = p.name.includes(searchQuery) || p.hn.includes(searchQuery)
    if (activeTab === "เสี่ยงสูง") return matchesSearch && p.risk === "HIGH"
    return matchesSearch
  })

  return (
    <div className="mx-auto w-full max-w-[390px] min-h-screen pb-32 overflow-x-hidden" style={{ background: "#0d0f1a" }}>
      
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 pt-12 pb-4" style={{ background: "rgba(13,15,26,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <h1 className="text-[20px] font-bold text-white tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>จัดการผู้ป่วย</h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95 shadow-lg" style={{ background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)", boxShadow: "0 4px 12px rgba(124,58,237,0.4)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </header>

      {/* ── Filter Tabs Row ── */}
      <div className="flex w-full mt-2 px-5 animate-fade-in overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 border-b border-white/5 w-full">
          {TABS.map((tab) => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative pb-3 text-[14px] font-bold transition-all whitespace-nowrap"
                style={{ color: isActive ? "#f1f5f9" : "#64748b" }}
              >
                {tab}
                {isActive && (
                  <div className="absolute bottom-[-1px] left-0 h-[3px] w-full rounded-t-sm" style={{ background: "#a78bfa", boxShadow: "0 -2px 10px rgba(167,139,250,0.5)" }} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <main className="flex flex-col gap-5 px-5 mt-5">
        
        {/* ── Search Bar ── */}
        <div className="relative animate-slide-up">
          <input 
            type="text" 
            placeholder="ค้นหา HN หรือชื่อ..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(167,139,250,0.15)",
              fontFamily: "'Sarabun', sans-serif",
            }}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>

        {/* ── Patient List ── */}
        <section className="flex flex-col gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
          {filteredPatients.map((patient, i) => {
            const isSelected = selectedIds.includes(patient.id)
            const riskColor = patient.risk === "HIGH" ? "#f43f5e" : patient.risk === "MEDIUM" ? "#fb923c" : "#10b981"
            const riskBg = patient.risk === "HIGH" ? "rgba(244,63,94,0.1)" : patient.risk === "MEDIUM" ? "rgba(251,146,60,0.1)" : "rgba(16,185,129,0.1)"
            
            return (
              <div 
                key={patient.id} 
                className={`relative flex flex-col gap-3 rounded-2xl p-4 transition-all duration-200 ${isSelected ? "ring-2 ring-offset-2 ring-offset-[#0d0f1a] ring-[#a78bfa]" : ""}`}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid rgba(167,139,250,0.1)`,
                  borderLeft: `4px solid ${riskColor}`,
                  animationDelay: `${i * 50}ms`
                }}
                onClick={() => toggleSelect(patient.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-mono text-[11px] text-[#2dd4bf] font-bold tracking-wider">{patient.hn}</span>
                    <h3 className="text-[16px] font-bold text-white mt-0.5">{patient.name}</h3>
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "bg-[#a78bfa] border-transparent" : "border-white/10"}`}>
                    {isSelected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <span className="rounded-full px-3 py-0.5 text-[10px] font-bold" style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)" }}>{patient.diagnosis}</span>
                  <span className="text-[11px] font-mono text-[#64748b] ml-auto">พบล่าสุด {patient.lastSeen}</span>
                </div>

                {/* Risk Bar */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ background: riskColor, width: patient.risk === "HIGH" ? "85%" : patient.risk === "MEDIUM" ? "45%" : "15%", boxShadow: `0 0 10px ${riskColor}40` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                  <div className="flex gap-3">
                    <button className="text-[12px] font-bold text-[#2dd4bf] hover:opacity-80 transition-opacity">ดูโปรไฟล์</button>
                    <button className="text-[12px] font-bold text-[#a78bfa] hover:opacity-80 transition-opacity">แก้ไข</button>
                  </div>
                  <button className="text-[#64748b]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                  </button>
                </div>
              </div>
            )
          })}
        </section>
      </main>

      {/* ── Bulk Action Bar ── */}
      {selectedIds.length > 0 && (
        <div 
          className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[350px] z-[60] flex items-center justify-between rounded-3xl p-4 animate-slide-up shadow-2xl"
          style={{ 
            background: "rgba(17, 24, 39, 0.95)", 
            backdropFilter: "blur(20px)", 
            border: "1px solid rgba(167,139,250,0.3)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
          }}
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#a78bfa] uppercase tracking-widest leading-none">เลือกแล้ว</span>
            <span className="text-[16px] font-bold text-white mt-1">{selectedIds.length} คน</span>
          </div>
          
          <div className="flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f43f5e]/15 border border-[#f43f5e]/30 text-[#f43f5e]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>
        </div>
      )}

      {/* Styled scrollbar hide */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
