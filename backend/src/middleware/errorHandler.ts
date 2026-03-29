import type { NextFunction, Request, Response } from "express"
import { ZodError } from "zod"

import { ApiError } from "../utils/apiError"

export const notFoundHandler = (_request: Request, response: Response) => {
  response.status(404).json({
    error: "ไม่พบเส้นทางที่ร้องขอ",
    code: "ROUTE_NOT_FOUND"
  })
}

export const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  if (error instanceof ApiError) {
    return response.status(error.statusCode).json({
      error: error.message,
      code: error.code
    })
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      error: error.issues.map((issue) => issue.message).join(", "),
      code: "VALIDATION_ERROR"
    })
  }

  return response.status(500).json({
    error: "เกิดข้อผิดพลาดภายในระบบ",
    code: "INTERNAL_SERVER_ERROR"
  })
}
