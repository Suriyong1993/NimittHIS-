import { Role } from "@prisma/client"
import { Router } from "express"

import { authenticate } from "../../middleware/auth"
import { authorize } from "../../middleware/rbac"
import { validate } from "../../middleware/validate"
import { notificationsService } from "./notifications.service"
import { bulkReminderSchema, sendSmsSchema } from "./notifications.schema"

export const notificationsRouter = Router()

notificationsRouter.use(authenticate)

notificationsRouter.post(
  "/sms",
  authorize(Role.NURSE, Role.DOCTOR, Role.ADMIN),
  validate(sendSmsSchema),
  async (request, response) => {
    const result = await notificationsService.sendSms(
      request.body.patientId,
      request.body.message,
      request.body.appointmentId
    )

    response.json({
      data: result,
      message: "ส่งข้อความสำเร็จ"
    })
  }
)

notificationsRouter.post(
  "/bulk-reminder",
  authorize(Role.NURSE, Role.DOCTOR, Role.ADMIN),
  validate(bulkReminderSchema),
  async (request, response) => {
    const result = await notificationsService.sendBulkReminder(request.body.date)
    response.json({
      data: result,
      message: "ส่งข้อความเตือนแบบกลุ่มสำเร็จ"
    })
  }
)
