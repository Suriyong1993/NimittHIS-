import { z } from "zod"

export const sendSmsSchema = z.object({
  patientId: z.string().min(1, "กรุณาระบุผู้ป่วย"),
  message: z.string().min(1, "กรุณาระบุข้อความ"),
  appointmentId: z.string().optional()
})

export const bulkReminderSchema = z.object({
  date: z.string().datetime("วันที่ไม่ถูกต้อง")
})
