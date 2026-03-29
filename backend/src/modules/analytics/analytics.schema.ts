import { z } from "zod"

export const noShowTrendQuerySchema = z.object({
  period: z.enum(["month", "quarter", "year"]).default("month")
})
