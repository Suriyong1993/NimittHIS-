import type { Request, Response } from "express"

import type { ListPatientsQuery } from "./patients.schema"
import { patientsService } from "./patients.service"

export class PatientsController {
  async list(request: Request, response: Response) {
    const result = await patientsService.list(request.query as unknown as ListPatientsQuery)
    response.json({ data: result })
  }

  async getById(request: Request, response: Response) {
    const result = await patientsService.getById(request.params.id as string)
    response.json({ data: result })
  }

  async create(request: Request, response: Response) {
    const result = await patientsService.create(request.body)
    response.status(201).json({
      data: result,
      message: "สร้างข้อมูลผู้ป่วยสำเร็จ"
    })
  }

  async update(request: Request, response: Response) {
    const result = await patientsService.update(request.params.id as string, request.body)
    response.json({
      data: result,
      message: "อัปเดตข้อมูลผู้ป่วยสำเร็จ"
    })
  }

  async getStats(request: Request, response: Response) {
    const result = await patientsService.getStats(request.params.id as string)
    response.json({ data: result })
  }

  async highRisk(request: Request, response: Response) {
    const result = await patientsService.getHighRisk(Number(request.query.limit))
    response.json({ data: result })
  }
}

export const patientsController = new PatientsController()
