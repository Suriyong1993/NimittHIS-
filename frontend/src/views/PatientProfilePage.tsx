import { Card } from "../components/ui/Card"

export function PatientProfilePage() {
  return (
    <Card>
      <h3 className="text-xl font-semibold">โปรไฟล์ผู้ป่วย</h3>
      <p className="mt-3 text-sm leading-7 text-nimitt-muted">
        route พร้อมสำหรับ patient profile, stats และ timeline โดยจะต่อรายละเอียด layout และฟอร์มเพิ่มบันทึกในเฟสถัดไป
      </p>
    </Card>
  )
}
