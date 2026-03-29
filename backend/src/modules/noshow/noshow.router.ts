import { Role } from "@prisma/client"
import { Router } from "express"

import { authenticate } from "../../middleware/auth"
import { authorize } from "../../middleware/rbac"
import { validate } from "../../middleware/validate"
import { noShowController } from "./noshow.controller"
import { bulkUpdateStatusSchema, noShowStatisticsQuerySchema } from "./noshow.schema"

export const noShowRouter = Router()

noShowRouter.use(authenticate)

noShowRouter.get("/risk-list", (request, response) => noShowController.riskList(request, response))
noShowRouter.get("/today-unattended", (request, response) =>
  noShowController.todayUnattended(request, response)
)
noShowRouter.get("/statistics", validate(noShowStatisticsQuerySchema, "query"), (request, response) =>
  noShowController.statistics(request, response)
)
noShowRouter.post(
  "/bulk-update-status",
  authorize(Role.NURSE, Role.ADMIN),
  validate(bulkUpdateStatusSchema),
  (request, response) => noShowController.bulkUpdateStatus(request, response)
)
