"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { getClinicBreakdown, getDashboardStats, getNoShowTrend } from "../api/analytics"

type Period = "month" | "quarter" | "year"

const fallbackTrend = [
  { month: "ม.ค.", count: 3, total: 28 },
  { month: "ก.พ.", count: 4, total: 30 },
  { month: "มี.ค.", count: 2, total: 26 },
  { month: "เม.ย.", count: 5, total: 33 },
  { month: "พ.ค.", count: 3, total: 29 },
  { month: "มิ.ย.", count: 2, total: 31 }
]

const fallbackClinic = [
  { name: "จิตเวชผู้ใหญ่", total: 42, noShow: 5 },
  { name: "ติดตามยา", total: 31, noShow: 3 },
  { name: "ให้คำปรึกษา", total: 24, noShow: 2 }
]

export function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("month")

  const { data: dashboardData } = useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: getDashboardStats,
    retry: false
  })

  const { data: trendData } = useQuery({
    queryKey: ["analytics", "trend", period],
    queryFn: () => getNoShowTrend(period),
    retry: false
  })

  const { data: clinicData } = useQuery({
    queryKey: ["analytics", "clinic"],
    queryFn: getClinicBreakdown,
    retry: false
  })

  const trend = useMemo(() => (Array.isArray(trendData) ? trendData : fallbackTrend), [trendData])
  const clinics = useMemo(() => (Array.isArray(clinicData) ? clinicData : fallbackClinic), [clinicData])
  const stats = dashboardData?.todayStats ?? { total: 24, attended: 14, noShow: 3, pending: 7 }
  const attendanceRate = stats.total ? Math.round((stats.attended / stats.total) * 100) : 0

  return (
    <div className="space-y-4 md:space-y-5 xl:space-y-6">
      <section className="section-card px-5 py-6 md:px-7 xl:px-8">
        <div className="panel-head gap-4">
          <div className="max-w-3xl">
            <span className="eyebrow">Clinical Analytics</span>
            <h2 className="mt-4 text-[28px] font-semibold tracking-[-0.04em] md:text-[36px]">
              มุมมองวิเคราะห์ที่ช่วยให้ตัดสินใจได้เร็วขึ้นในระดับคลินิก
            </h2>
            <p className="mt-3 text-sm leading-8 md:text-[15px]" style={{ color: "var(--ink-muted)" }}>
              แสดงภาพรวมการมาตามนัด แนวโน้ม no-show และประสิทธิภาพรายคลินิกในรูปแบบที่อ่านง่ายทั้งจาก desktop และ tablet
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: "month", label: "รายเดือน" },
              { key: "quarter", label: "รายไตรมาส" },
              { key: "year", label: "ทั้งปี" }
            ].map((item) => (
              <button
                key={item.key}
                className="tap-soft rounded-full px-4 py-2.5 text-sm font-semibold"
                style={
                  period === item.key
                    ? { background: "var(--brand)", color: "white" }
                    : { background: "var(--surface-strong)", color: "var(--ink-soft)", border: "1px solid var(--line)" }
                }
                onClick={() => setPeriod(item.key as Period)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="content-grid md:grid-cols-3">
        {[
          { label: "อัตรามาตามนัด", value: `${attendanceRate}%`, tone: "status-success" },
          { label: "ขาดนัดวันนี้", value: stats.noShow, tone: "status-danger" },
          { label: "คิวค้างดำเนินการ", value: stats.pending, tone: "status-warning" }
        ].map((item) => (
          <div key={item.label} className="metric-card">
            <span className={`status-badge ${item.tone}`}>{item.label}</span>
            <p className="metric-value">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="content-grid xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <div className="section-card px-5 py-6 md:px-6">
          <div className="panel-head">
            <div>
              <h3 className="text-[24px] font-semibold tracking-[-0.03em]">แนวโน้ม no-show</h3>
              <p className="mt-1 text-sm leading-7" style={{ color: "var(--ink-muted)" }}>
                เปรียบเทียบจำนวนขาดนัดกับจำนวนคิวทั้งหมดในแต่ละช่วงเวลา
              </p>
            </div>
          </div>
          <div className="mt-6 h-[320px] md:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1f6f8b" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#1f6f8b" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(24,52,76,0.08)" />
                <XAxis dataKey="month" tick={{ fill: "#6f879d", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6f879d", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.96)",
                    border: "1px solid rgba(24,52,76,0.08)",
                    borderRadius: 18,
                    boxShadow: "0 18px 34px rgba(24,52,76,0.08)"
                  }}
                />
                <Area type="monotone" dataKey="total" stroke="#1f6f8b" fill="url(#attendanceFill)" strokeWidth={3} />
                <Area type="monotone" dataKey="count" stroke="#d35d6e" fill="transparent" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="section-card px-5 py-6 md:px-6">
          <div className="panel-head">
            <div>
              <h3 className="text-[24px] font-semibold tracking-[-0.03em]">ภาพรวมรายคลินิก</h3>
              <p className="mt-1 text-sm leading-7" style={{ color: "var(--ink-muted)" }}>
                ใช้ดูสัดส่วนคิวรวมและ no-show เพื่อวางแผนกำลังคนและ outreach
              </p>
            </div>
          </div>
          <div className="mt-6 h-[320px] md:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clinics}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(24,52,76,0.08)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#6f879d", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6f879d", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.96)",
                    border: "1px solid rgba(24,52,76,0.08)",
                    borderRadius: 18,
                    boxShadow: "0 18px 34px rgba(24,52,76,0.08)"
                  }}
                />
                <Bar dataKey="total" fill="#1f6f8b" radius={[10, 10, 0, 0]} />
                <Bar dataKey="noShow" fill="#2c9f85" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  )
}
