import { Card } from "../components/ui/Card"

export function NoShowTrackingPage() {
  return (
    <Card>
      <h3 className="text-xl font-semibold">ติดตามขาดนัด</h3>
      <p className="mt-3 text-sm leading-7 text-nimitt-muted">
        backend endpoints สำหรับ `risk-list`, `today-unattended`, และ `overdue` พร้อมแล้ว รอเติม tabs และ quick actions
      </p>
    </Card>
  )
}
