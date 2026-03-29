import { RiskLevel } from "@prisma/client"
import { z } from "zod"

export const patientIdParamSchema = z.object({
  id: z.string().min(1, "ไม่พบรหัสผู้ป่วย")
})

export const listPatientsQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  riskLevel: z.nativeEnum(RiskLevel).optional()
})

export const highRiskQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20)
})

export const createPatientSchema = z.object({
  hn: z.string().min(1, "กรุณากรอก HN"),
  firstName: z.string().min(1, "กรุณากรอกชื่อ"),
  lastName: z.string().min(1, "กรุณากรอกนามสกุล"),
  dateOfBirth: z.string().datetime("วันเกิดไม่ถูกต้อง"),
  gender: z.string().min(1, "กรุณาระบุเพศ"),
  bloodType: z.string().optional(),
  phone: z.string().optional(),
  idCard: z.string().optional(),
  passportNo: z.string().optional(),
  insuranceType: z.string().optional(),
  allergies: z.array(z.string()).default([])
})

export const updatePatientSchema = createPatientSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "กรุณาระบุข้อมูลที่ต้องการแก้ไข"
)

export type ListPatientsQuery = z.infer<typeof listPatientsQuerySchema>
export type CreatePatientDto = z.infer<typeof createPatientSchema>
export type UpdatePatientDto = z.infer<typeof updatePatientSchema>
