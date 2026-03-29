import type { Request, Response } from "express"

import type { ListAppointmentsQuery } from "./appointments.schema"
import { appointmentsService } from "./appointments.service"

export class AppointmentsController {
  async list(request: Request, response: Response) {
    const result = await appointmentsService.list(request.query as unknown as ListAppointmentsQuery)
    response.json({ data: result })
  }

  async today(_request: Request, response: Response) {
    const result = await appointmentsService.getToday()
    response.json({ data: result })
  }

  async overdue(_request: Request, response: Response) {
    const result = await appointmentsService.getOverdue()
    response.json({ data: result })
  }

  async getById(request: Request, response: Response) {
    const result = await appointmentsService.getById(request.params.id as string)
    response.json({ data: result })
  }

  async create(request: Request, response: Response) {
    const result = await appointmentsService.create(request.body, request.user!.userId)
    response.status(201).json({
      data: result,
      message: "สร้างนัดหมายสำเร็จ"
    })
  }

  async update(request: Request, response: Response) {
    const result = await appointmentsService.update(request.params.id as string, request.body)
    response.json({
      data: result,
      message: "อัปเดตนัดหมายสำเร็จ"
    })
  }

  async updateStatus(request: Request, response: Response) {
    const result = await appointmentsService.updateStatus(
      request.params.id as string,
      request.body.status,
      request.body.noShowReason,
      request.user!.userId
    )

    response.json({
      data: result,
      message: "อัปเดตสถานะนัดหมายสำเร็จ"
    })
  }

  async remove(request: Request, response: Response) {
    const result = await appointmentsService.softDelete(request.params.id as string, request.user!.userId)
    response.json({
      data: result,
      message: "ยกเลิกนัดหมายสำเร็จ"
    })
  }
}

export const appointmentsController = new AppointmentsController()
