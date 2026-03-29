import { AppointmentStatus } from "@prisma/client"
import { z } from "zod"

export const noShowStatisticsQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  clinicId: z.string().optional()
})

export const bulkUpdateStatusSchema = z.object({
  appointmentIds: z.array(z.string().min(1)).min(1, "กรุณาระบุนัดหมายอย่างน้อย 1 รายการ"),
  status: z.nativeEnum(AppointmentStatus)
})
