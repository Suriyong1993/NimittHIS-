import { Card } from "../components/ui/Card"

export function AnalyticsPage() {
  return (
    <Card>
      <h3 className="text-xl font-semibold">วิเคราะห์ข้อมูล</h3>
      <p className="mt-3 text-sm leading-7 text-nimitt-muted">
        analytics API พร้อมแล้ว ทั้ง dashboard, no-show trend และ clinic breakdown ในเฟสถัดไปจะใส่ Recharts เต็มรูปแบบ
      </p>
    </Card>
  )
}
