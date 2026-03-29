import type { Request, Response } from "express"

import type { ListTimelineQuery } from "./timeline.schema"
import { timelineService } from "./timeline.service"

export class TimelineController {
  async list(request: Request, response: Response) {
    const result = await timelineService.list(
      request.params.id as string,
      request.query as unknown as ListTimelineQuery
    )
    response.json({ data: result })
  }

  async create(request: Request, response: Response) {
    const result = await timelineService.create(
      request.params.id as string,
      request.body,
      request.user!.userId
    )
    response.status(201).json({
      data: result,
      message: "เพิ่ม timeline สำเร็จ"
    })
  }

  async update(request: Request, response: Response) {
    const result = await timelineService.updateEntry(
      request.params.entryId as string,
      request.body,
      request.user!.userId
    )

    response.json({
      data: result,
      message: "อัปเดต timeline สำเร็จ"
    })
  }

  async delete(request: Request, response: Response) {
    await timelineService.delete(request.params.entryId as string)
    response.json({
      data: true,
      message: "ลบ timeline สำเร็จ"
    })
  }
}

export const timelineController = new TimelineController()
