"use client"

import { useState } from "react"
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
import { Card } from "../components/ui/Card"

type Period = "month" | "quarter" | "year"

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "month", label: "เดือนนี้" },
  { value: "quarter", label: "ไตรมาส" },
  { value: "year", label: "ปีนี้" }
]

function ChartSkeleton({ height = 260 }: { height?: number }) {
  return (
    <div className="animate-shimmer rounded-2xl" style={{ height }} />
  )
}

export function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("month")

  const statsQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStats,
    staleTime: 60_000
  })

  const trendQuery = useQuery({
    queryKey: ["noshow-trend", period],
    queryFn: () => getNoShowTrend(period),
    staleTime: 120_000
  })

  const clinicQuery = useQuery({
    queryKey: ["clinic-breakdown"],
    queryFn: getClinicBreakdown,
    staleTime: 120_000
  })

  const stats = statsQuery.data?.todayStats
  const trendData: Record<string, unknown>[] = trendQuery.data?.buckets ?? []
  const clinicData: Record<string, unknown>[] = clinicQuery.data?.clinics ?? []

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-slide-up">
        <div>
          <h2 className="text-2xl font-semibold text-nimitt-ink">วิเคราะห์ข้อมูล</h2>
          <p className="mt-0.5 text-sm text-nimitt-muted">สรุปผลตามคลินิกและช่วงเวลา</p>
        </div>
        <div className="flex gap-1 rounded-2xl border border-nimitt-border bg-nimitt-bg p-1">
          {PERIOD_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={`rounded-xl px-4 py-1.5 text-sm font-medium transition-all ${
                period === value
                  ? "bg-white text-nimitt-ink shadow-sm"
                  : "text-nimitt-muted hover:text-nimitt-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid animate-slide-up gap-4 sm:grid-cols-3" style={{ animationDelay: "75ms" }}>
        {[
          {
            label: "อัตราการมาตามนัด",
            value: stats?.total
              ? `${Math.round(((stats.attended ?? 0) / stats.total) * 100)}%`
              : "—",
            sub: "วันนี้",
            color: "text-nimitt-green"
          },
          {
            label: "อัตราขาดนัด",
            value: stats?.total
              ? `${Math.round(((stats.noShow ?? 0) / stats.total) * 100)}%`
              : "—",
            sub: "วันนี้",
            color: "text-nimitt-red"
          },
          {
            label: "รอดำเนินการ",
            value: stats?.pending ?? "—",
            sub: "รายการ",
            color: "text-nimitt-amber"
          }
        ].map(({ label, value, sub, color }, i) => (
          <Card
            key={label}
            className="animate-slide-up text-center"
            style={{ animationDelay: `${75 + i * 75}ms` } as React.CSSProperties}
          >
            <p className="text-sm text-nimitt-muted">{label}</p>
            <p className={`mt-2 font-mono text-4xl font-semibold ${color}`}>{value}</p>
            <p className="mt-1 text-xs text-nimitt-faint">{sub}</p>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* No-show trend */}
        <Card className="animate-slide-up" style={{ animationDelay: "225ms" } as React.CSSProperties}>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-nimitt-ink">แนวโน้มการขาดนัด</h3>
              <p className="text-xs text-nimitt-muted mt-0.5">เปรียบเทียบมาตามนัด vs ขาดนัด</p>
            </div>
          </div>
          {trendQuery.isLoading ? (
            <ChartSkeleton />
          ) : trendData.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-nimitt-muted">ยังไม่มีข้อมูล</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="attended-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="noshow-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#A0A09A" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#A0A09A" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #E5E5E0", fontSize: 12 }}
                  labelStyle={{ fontWeight: 600, color: "#111110" }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                <Area type="monotone" dataKey="attended" name="มาตามนัด" stroke="#16A34A" strokeWidth={2} fill="url(#attended-grad)" dot={false} />
                <Area type="monotone" dataKey="noShow" name="ขาดนัด" stroke="#DC2626" strokeWidth={2} fill="url(#noshow-grad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Clinic breakdown */}
        <Card className="animate-slide-up" style={{ animationDelay: "300ms" } as React.CSSProperties}>
          <div className="mb-5">
            <h3 className="text-base font-semibold text-nimitt-ink">สรุปตามคลินิก</h3>
            <p className="text-xs text-nimitt-muted mt-0.5">จำนวนนัดหมายแต่ละแผนก</p>
          </div>
          {clinicQuery.isLoading ? (
            <ChartSkeleton />
          ) : clinicData.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-nimitt-muted">ยังไม่มีข้อมูล</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={clinicData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E0" vertical={false} />
                <XAxis dataKey="clinicName" tick={{ fontSize: 10, fill: "#A0A09A" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#A0A09A" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #E5E5E0", fontSize: 12 }}
                  labelStyle={{ fontWeight: 600, color: "#111110" }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                <Bar dataKey="total" name="ทั้งหมด" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={48} />
                <Bar dataKey="noShow" name="ขาดนัด" fill="#DC2626" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  )
}
