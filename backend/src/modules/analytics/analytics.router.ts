import { Router } from "express"

import { authenticate } from "../../middleware/auth"
import { validate } from "../../middleware/validate"
import { analyticsService } from "./analytics.service"
import { noShowTrendQuerySchema } from "./analytics.schema"

export const analyticsRouter = Router()

analyticsRouter.use(authenticate)

analyticsRouter.get("/dashboard", async (_request, response) => {
  const result = await analyticsService.getDashboard()
  response.json({ data: result })
})

analyticsRouter.get("/noshow-trend", validate(noShowTrendQuerySchema, "query"), async (request, response) => {
  const period = request.query.period as "month" | "quarter" | "year"
  const result = await analyticsService.getNoShowTrend(period)
  response.json({ data: result })
})

analyticsRouter.get("/clinic-breakdown", async (_request, response) => {
  const result = await analyticsService.getClinicBreakdown()
  response.json({ data: result })
})
