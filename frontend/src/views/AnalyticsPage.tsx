"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from "recharts"

import { getDashboardStats, getNoShowTrend, getClinicBreakdown } from "../api/analytics"

type Period = "month" | "quarter" | "year"

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "month", label: "Monthly" },
  { value: "quarter", label: "Quarterly" },
  { value: "year", label: "Year-to-date" }
]

function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="animate-pulse rounded-[32px] bg-white/5" style={{ height }} />
  )
}

const CHART_COLORS = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  grid: "rgba(255,255,255,0.05)",
  text: "#94a3b8"
}

export function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("month")

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStats,
    staleTime: 60_000
  })

  const { data: trendDataRaw, isLoading: isTrendLoading } = useQuery({
    queryKey: ["noshow-trend", period],
    queryFn: () => getNoShowTrend(period),
    staleTime: 120_000
  })

  const { data: clinicDataRaw, isLoading: isClinicLoading } = useQuery({
    queryKey: ["clinic-breakdown"],
    queryFn: getClinicBreakdown,
    staleTime: 120_000
  })

  const stats = statsData?.todayStats
  const trendData = useMemo(() => (trendDataRaw as any[]) ?? [], [trendDataRaw])
  const clinicData = useMemo(() => (clinicDataRaw as any[]) ?? [], [clinicDataRaw])

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between animate-entrance">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">วิเคราะห์ประสิทธิภาพ</h1>
          <p className="text-muted text-sm max-w-md">สรุปสถิติและแนวโน้มการเข้ารับบริการ เพื่อการตัดสินใจเชิงยุทธศาสตร์</p>
        </div>
        
        <div className="flex gap-1.5 p-1.5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
          {PERIOD_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={`px-5 py-2 rounded-xl text-xs font-bold tracking-tight transition-all ${
                period === value
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-subtle hover:text-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-entrance [animation-delay:100ms]">
        {[
          {
            label: "อัตราการมาตามนัด",
            value: stats?.total ? `${Math.round(((stats.attended ?? 0) / stats.total) * 100)}%` : "—",
            sub: "Patient Retention",
            color: "text-teal-400",
            bg: "bg-teal-500/5",
            accent: "#2dd4bf"
          },
          {
            label: "อัตราขาดนัด",
            value: stats?.total ? `${Math.round(((stats.noShow ?? 0) / stats.total) * 100)}%` : "—",
            sub: "Missed Opportunities",
            color: "text-rose-400",
            bg: "bg-rose-500/5",
            accent: "#f43f5e"
          },
          {
            label: "รวมรายการนัดวันนี้",
            value: stats?.total ?? "—",
            sub: "Total Scheduled",
            color: "text-primary",
            bg: "bg-primary/5",
            accent: "var(--color-primary)"
          }
        ].map((kpi, i) => (
          <div key={i} className="glass p-8 rounded-[32px] border-white/5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full opacity-20 blur-2xl" style={{ backgroundColor: kpi.accent }} />
             <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{kpi.label}</p>
             <p className={`mt-3 text-5xl font-bold tracking-tighter ${kpi.color}`}>{kpi.value}</p>
             <p className="mt-2 text-[10px] font-medium text-subtle">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-8 lg:grid-cols-2 animate-entrance [animation-delay:200ms]">
        
        {/* No-show trend Area Chart */}
        <div className="glass p-8 rounded-[40px] border-white/5">
          <div className="mb-8">
            <h3 className="text-xl font-bold tracking-tight">แนวโน้มการเข้าระบบ</h3>
            <p className="text-xs text-muted mt-1">วิเคราะห์เปรียบเทียบระหว่างมาตามนัดและขาดนัด</p>
          </div>
          
          {isTrendLoading ? <ChartSkeleton /> : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="primary-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 10, fill: CHART_COLORS.text, fontWeight: 600 }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: CHART_COLORS.text, fontWeight: 600 }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: "rgba(13,15,26,0.9)", 
                      borderRadius: "20px", 
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                      fontSize: "12px",
                      backdropFilter: "blur(10px)"
                    }}
                    itemStyle={{ fontWeight: 700 }}
                  />
                  <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }} />
                  <Area type="monotone" dataKey="total" name="มาตามนัด" stroke="var(--color-primary)" strokeWidth={3} fill="url(#primary-grad)" dot={{ r: 4, fill: "var(--color-primary)", strokeWidth: 0 }} activeDot={{ r: 6, stroke: "white", strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="count" name="ขาดนัด" stroke="#f43f5e" strokeWidth={3} fill="transparent" strokeDasharray="6 6" dot={{ r: 4, fill: "#f43f5e", strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Clinic breakdown Bar Chart */}
        <div className="glass p-8 rounded-[40px] border-white/5">
          <div className="mb-8">
            <h3 className="text-xl font-bold tracking-tight">ภาพรวมคลินิก</h3>
            <p className="text-xs text-muted mt-1">สรุปจำนวนนัดหมายแยกตามแผนกสุขภาพจิต</p>
          </div>
          
          {isClinicLoading ? <ChartSkeleton /> : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clinicData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10, fill: CHART_COLORS.text, fontWeight: 600 }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: CHART_COLORS.text, fontWeight: 600 }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                    contentStyle={{ 
                      backgroundColor: "rgba(13,15,26,0.9)", 
                      borderRadius: "20px", 
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: "12px",
                      backdropFilter: "blur(10px)"
                    }}
                  />
                  <Bar dataKey="total" name="นัดหมายทั้งหมด" fill="var(--color-primary)" radius={[8, 8, 0, 0]} barSize={32} />
                  <Bar dataKey="noShow" name="สถิติขาดนัด" fill="#f43f5e" radius={[8, 8, 0, 0]} barSize={8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>

    </div>
  )
}

