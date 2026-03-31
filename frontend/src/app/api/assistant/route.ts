import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"
import { z } from "zod"

import { ASSISTANT_SYSTEM_PROMPT, buildAssistantContext } from "@/lib/assistant-context"

const requestSchema = z.object({
  message: z.string().min(1).max(4000),
  page: z.string().min(1).max(200),
  role: z.string().optional(),
  userName: z.string().optional()
})

export async function POST(request: Request) {
  const geminiApiKey = process.env.GEMINI_API_KEY

  if (!geminiApiKey) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY", code: "CONFIG_MISSING" },
      { status: 500 }
    )
  }

  const body = await request.json()
  const parsed = requestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid assistant request payload", code: "VALIDATION_ERROR" },
      { status: 400 }
    )
  }

  try {
    const ai = new GoogleGenAI({ apiKey: geminiApiKey })
    const context = buildAssistantContext(parsed.data)

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${ASSISTANT_SYSTEM_PROMPT}\n\nบริบทระบบ:\n${context}\n\nคำขอจากผู้ใช้:\n${parsed.data.message}`
            }
          ]
        }
      ]
    })

    return NextResponse.json({
      data: {
        reply: response.text ?? "ขออภัย ระบบผู้ช่วยยังไม่สามารถตอบกลับได้ในขณะนี้"
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Assistant request failed",
        code: "ASSISTANT_FAILED"
      },
      { status: 500 }
    )
  }
}
