"use client"

import { useQuery } from "@tanstack/react-query"

import { getDashboardStats } from "../api/analytics"
import { Card } from "../components/ui/Card"

export function DashboardPage() {
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStats
  })

  const stats = data?.todayStats

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["นัดวันนี้", stats?.total ?? 0],
          ["มาตามนัด", stats?.attended ?? 0],
          ["ขาดนัด", stats?.noShow ?? 0],
          ["รอดำเนินการ", stats?.pending ?? 0]
        ].map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm text-nimitt-muted">{label}</p>
            <p className="mt-3 text-4xl font-semibold text-nimitt-ink">{value}</p>
          </Card>
        ))}
      </div>
      <Card>
        <h3 className="text-xl font-semibold">ภาพรวมแดชบอร์ด</h3>
        <p className="mt-3 text-sm leading-7 text-nimitt-muted">
          พื้นฐาน frontend พร้อมแล้วและเชื่อม `/analytics/dashboard` เรียบร้อย ในเฟสถัดไปจะเติม risk table,
          donut chart และ today schedule แบบโต้ตอบครบตามสเปก
        </p>
      </Card>
    </div>
  )
}
