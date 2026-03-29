import { Role } from "@prisma/client"
import { Router } from "express"

import { authenticate } from "../../middleware/auth"
import { authorize } from "../../middleware/rbac"
import { validate } from "../../middleware/validate"
import { appointmentsController } from "./appointments.controller"
import {
  appointmentIdParamSchema,
  createAppointmentSchema,
  listAppointmentsQuerySchema,
  updateAppointmentSchema,
  updateAppointmentStatusSchema
} from "./appointments.schema"

export const appointmentsRouter = Router()

appointmentsRouter.use(authenticate)

appointmentsRouter.get("/today", (request, response) => appointmentsController.today(request, response))
appointmentsRouter.get("/overdue", (request, response) => appointmentsController.overdue(request, response))
appointmentsRouter.get("/", validate(listAppointmentsQuerySchema, "query"), (request, response) =>
  appointmentsController.list(request, response)
)
appointmentsRouter.get("/:id", validate(appointmentIdParamSchema, "params"), (request, response) =>
  appointmentsController.getById(request, response)
)
appointmentsRouter.post("/", validate(createAppointmentSchema), (request, response) =>
  appointmentsController.create(request, response)
)
appointmentsRouter.put(
  "/:id",
  validate(appointmentIdParamSchema, "params"),
  validate(updateAppointmentSchema),
  (request, response) => appointmentsController.update(request, response)
)
appointmentsRouter.patch(
  "/:id/status",
  validate(appointmentIdParamSchema, "params"),
  validate(updateAppointmentStatusSchema),
  (request, response) => appointmentsController.updateStatus(request, response)
)
appointmentsRouter.delete(
  "/:id",
  authorize(Role.NURSE, Role.ADMIN),
  validate(appointmentIdParamSchema, "params"),
  (request, response) => appointmentsController.remove(request, response)
)
