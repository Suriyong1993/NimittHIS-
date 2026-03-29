import { Card } from "../components/ui/Card"

export function AppointmentListPage() {
  return (
    <Card>
      <h3 className="text-xl font-semibold">รายการนัดหมาย</h3>
      <p className="mt-3 text-sm leading-7 text-nimitt-muted">
        โครง route และ shell พร้อมแล้ว หน้านี้จะเติม filter bar, table, และ modal นัดหมายใน Phase 5
      </p>
    </Card>
  )
}
