import { NoShowReason, TimelineType } from "@prisma/client"
import { z } from "zod"

export const timelineEntryIdParamSchema = z.object({
  entryId: z.string().min(1, "ไม่พบรหัส timeline")
})

export const listTimelineQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  type: z.nativeEnum(TimelineType).optional()
})

export const createTimelineEntrySchema = z.object({
  appointmentId: z.string().optional(),
  type: z.nativeEnum(TimelineType),
  entryDate: z.string().datetime("วันที่บันทึกไม่ถูกต้อง"),
  clinicName: z.string().optional(),
  doctorName: z.string().optional(),
  notes: z.string().optional(),
  noShowReason: z.nativeEnum(NoShowReason).optional()
})

export const updateTimelineEntrySchema = createTimelineEntrySchema
  .omit({
    appointmentId: true
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, "กรุณาระบุข้อมูลที่ต้องการแก้ไข")

export type ListTimelineQuery = z.infer<typeof listTimelineQuerySchema>
export type CreateTimelineEntryDto = z.infer<typeof createTimelineEntrySchema>
export type UpdateTimelineEntryDto = z.infer<typeof updateTimelineEntrySchema>
