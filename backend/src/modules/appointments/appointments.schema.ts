import { AppointmentStatus, NoShowReason } from "@prisma/client"
import { z } from "zod"

export const appointmentIdParamSchema = z.object({
  id: z.string().min(1, "ไม่พบรหัสนัดหมาย")
})

export const listAppointmentsQuerySchema = z.object({
  date: z.string().optional(),
  clinicId: z.string().optional(),
  doctorId: z.string().optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  patientId: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
})

export const createAppointmentSchema = z.object({
  patientId: z.string().min(1, "กรุณาระบุผู้ป่วย"),
  clinicId: z.string().min(1, "กรุณาระบุคลินิก"),
  doctorId: z.string().optional(),
  roomId: z.string().optional(),
  appointmentDate: z.string().datetime("วันนัดไม่ถูกต้อง"),
  timeFrom: z.string().regex(/^\d{2}:\d{2}$/, "เวลาเริ่มไม่ถูกต้อง"),
  timeTo: z.string().regex(/^\d{2}:\d{2}$/, "เวลาสิ้นสุดไม่ถูกต้อง"),
  reason: z.string().min(1, "กรุณาระบุเหตุผลการนัด"),
  notes: z.string().optional()
})

export const updateAppointmentSchema = createAppointmentSchema
  .extend({
    status: z.nativeEnum(AppointmentStatus).optional(),
    noShowReason: z.nativeEnum(NoShowReason).optional(),
    contactAttempts: z.coerce.number().int().min(0).optional(),
    confirmedAt: z.string().datetime().optional(),
    attendedAt: z.string().datetime().optional(),
    cancelledAt: z.string().datetime().optional(),
    overdueFlag: z.boolean().optional(),
    smsReminderSent: z.boolean().optional()
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, "กรุณาระบุข้อมูลที่ต้องการแก้ไข")

export const updateAppointmentStatusSchema = z.object({
  status: z.nativeEnum(AppointmentStatus),
  noShowReason: z.nativeEnum(NoShowReason).optional()
})

export type ListAppointmentsQuery = z.infer<typeof listAppointmentsQuerySchema>
export type CreateAppointmentDto = z.infer<typeof createAppointmentSchema>
export type UpdateAppointmentDto = z.infer<typeof updateAppointmentSchema>
