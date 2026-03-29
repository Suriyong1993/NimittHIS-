import { Role } from "@prisma/client"
import { Router } from "express"

import { authenticate } from "../../middleware/auth"
import { authorize } from "../../middleware/rbac"
import { validate } from "../../middleware/validate"
import { timelineController } from "./timeline.controller"
import {
  createTimelineEntrySchema,
  listTimelineQuerySchema,
  timelineEntryIdParamSchema,
  updateTimelineEntrySchema
} from "./timeline.schema"

export const timelineRouter = Router({ mergeParams: true })

timelineRouter.use(authenticate)

timelineRouter.get("/", validate(listTimelineQuerySchema, "query"), (request, response) =>
  timelineController.list(request, response)
)

timelineRouter.post("/", validate(createTimelineEntrySchema), (request, response) =>
  timelineController.create(request, response)
)

timelineRouter.put(
  "/:entryId",
  validate(timelineEntryIdParamSchema, "params"),
  validate(updateTimelineEntrySchema),
  (request, response) => timelineController.update(request, response)
)

timelineRouter.delete(
  "/:entryId",
  authorize(Role.ADMIN),
  validate(timelineEntryIdParamSchema, "params"),
  (request, response) => timelineController.delete(request, response)
)
