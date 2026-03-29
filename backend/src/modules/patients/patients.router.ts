import { Role } from "@prisma/client"
import { Router } from "express"

import { authenticate } from "../../middleware/auth"
import { authorize } from "../../middleware/rbac"
import { validate } from "../../middleware/validate"
import { timelineRouter } from "../timeline/timeline.router"
import { patientsController } from "./patients.controller"
import {
  createPatientSchema,
  highRiskQuerySchema,
  listPatientsQuerySchema,
  patientIdParamSchema,
  updatePatientSchema
} from "./patients.schema"

export const patientsRouter = Router()

patientsRouter.use(authenticate)

patientsRouter.get("/high-risk", validate(highRiskQuerySchema, "query"), (request, response) =>
  patientsController.highRisk(request, response)
)

patientsRouter.get("/", validate(listPatientsQuerySchema, "query"), (request, response) =>
  patientsController.list(request, response)
)

patientsRouter.get("/:id", validate(patientIdParamSchema, "params"), (request, response) =>
  patientsController.getById(request, response)
)

patientsRouter.post(
  "/",
  authorize(Role.NURSE, Role.DOCTOR, Role.ADMIN),
  validate(createPatientSchema),
  (request, response) => patientsController.create(request, response)
)

patientsRouter.put(
  "/:id",
  authorize(Role.NURSE, Role.DOCTOR, Role.ADMIN),
  validate(patientIdParamSchema, "params"),
  validate(updatePatientSchema),
  (request, response) => patientsController.update(request, response)
)

patientsRouter.get("/:id/stats", validate(patientIdParamSchema, "params"), (request, response) =>
  patientsController.getStats(request, response)
)

patientsRouter.use("/:id/timeline", validate(patientIdParamSchema, "params"), timelineRouter)
