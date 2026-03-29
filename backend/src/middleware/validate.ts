import type { NextFunction, Request, Response } from "express"
import type { AnyZodObject, ZodEffects, ZodTypeAny } from "zod"

import { ApiError } from "../utils/apiError"

type SchemaLike = AnyZodObject | ZodEffects<AnyZodObject> | ZodTypeAny

export const validate =
  (schema: SchemaLike, target: "body" | "query" | "params" = "body") =>
  async (request: Request, _response: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(request[target])
      ;(request as Request & Record<string, unknown>)[target] = parsed
      return next()
    } catch (error) {
      const message = error instanceof Error ? error.message : "ข้อมูลไม่ถูกต้อง"
      return next(new ApiError(400, "VALIDATION_ERROR", message))
    }
  }
