import type { Request, Response } from "express"

import { noShowService } from "./noshow.service"

export class NoShowController {
  async riskList(_request: Request, response: Response) {
    const result = await noShowService.getRiskList()
    response.json({ data: result })
  }

  async todayUnattended(_request: Request, response: Response) {
    const result = await noShowService.getTodayUnattended()
    response.json({ data: result })
  }

  async statistics(request: Request, response: Response) {
    const result = await noShowService.getStatistics(request.query)
    response.json({ data: result })
  }

  async bulkUpdateStatus(request: Request, response: Response) {
    const result = await noShowService.bulkUpdateStatus(
      request.body.appointmentIds,
      request.body.status,
      request.user!.userId
    )

    response.json({
      data: result,
      message: "อัปเดตสถานะแบบกลุ่มสำเร็จ"
    })
  }
}

export const noShowController = new NoShowController()
