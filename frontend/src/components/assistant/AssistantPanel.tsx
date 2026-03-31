"use client"

import { useMemo, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { usePathname } from "next/navigation"

import {
  ASSISTANT_MODE_HINTS,
  ASSISTANT_MODE_LABELS,
  type AssistantMode
} from "@/lib/assistant-context"
import { useAuthStore } from "@/store/authStore"
import { useUiStore } from "@/store/uiStore"
import { Button } from "../ui/Button"

type ChatMessage = {
  id: string
  role: "assistant" | "user"
  content: string
}

const quickPromptsByMode: Record<AssistantMode, string[]> = {
  ops: [
    "ช่วยสรุปสิ่งที่ต้องทำในเวรวันนี้ให้หน่อย",
    "ช่วยสรุปคิวที่ควรเร่งประสานก่อนเริ่ม session เช้า",
    "ช่วยเขียน handoff สั้นๆ ให้พยาบาลเวรต่อ"
  ],
  outreach: [
    "ช่วยร่างข้อความโทรติดตามผู้ป่วยที่ขาดนัดอย่างสุภาพ",
    "ช่วยลำดับความสำคัญผู้ป่วยเสี่ยงจากหน้าปัจจุบัน",
    "ช่วยสรุป action ถัดไปของแต่ละเคสติดตาม"
  ],
  scribe: [
    "ช่วยสรุปโน้ตนี้เป็น SOAP ภาษาไทย",
    "ช่วยจัดโครง CC PI Assessment Plan ให้พร้อมตรวจทาน",
    "ช่วยสรุปบทสนทนาเป็นบันทึกทางการแพทย์แบบสั้น"
  ],
  coding: [
    "ช่วยจัดโครง discharge summary ให้ครบหัวข้อ",
    "ช่วยชี้จุดที่ coder ควรทบทวนในเคสนี้",
    "ช่วยสรุป diagnosis/procedure ที่ควรมีหลักฐานรองรับ"
  ],
  paperless: [
    "ช่วยทำ checklist ความครบถ้วนของ note ก่อนส่งต่อ",
    "ช่วยตรวจว่ามีอะไรตกหล่นใน workflow paperless บ้าง",
    "ช่วยสรุปสิ่งที่ auditor ควรเช็กจากข้อมูลนี้"
  ],
  jaidee: [
    "ช่วงนี้รู้สึกเหนื่อยใจมาก ไม่ค่อยอยากคุยกับใคร",
    "ช่วยคุยกับฉันแบบไม่ตัดสินหน่อย",
    "วันนี้รู้สึกหนักไปหมด ไม่รู้จะเริ่มตรงไหนดี"
  ]
}

export function AssistantPanel() {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const assistantOpen = useUiStore((state) => state.assistantOpen)
  const setAssistantOpen = useUiStore((state) => state.setAssistantOpen)

  const [mode, setMode] = useState<AssistantMode>("ops")
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "ผู้ช่วยพร้อมแล้ว ตอนนี้คุณสามารถใช้เป็นผู้ช่วยงาน HOSxP, ผู้ช่วยติดตามขาดนัด, Medical Scribe, ผู้ช่วย Discharge / ICD, Paperless Audit และโหมดใจดีสำหรับคุยเชิงสุขภาพจิตได้"
    }
  ])

  const pageLabel = useMemo(() => {
    if (pathname?.startsWith("/appointments")) return "Appointment Operations"
    if (pathname?.startsWith("/noshow")) return "Outreach Board"
    if (pathname?.startsWith("/analytics")) return "Analytics"
    if (pathname?.startsWith("/patients/")) return "Patient Continuity Profile"
    return "Morning Command Center"
  }, [pathname])

  const quickPrompts = quickPromptsByMode[mode]

  const mutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          page: pageLabel,
          mode,
          role: user?.role,
          userName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error ?? "Assistant request failed")
      }

      return data.data.reply as string
    },
    onSuccess: (reply) => {
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", content: reply }
      ])
    },
    onError: (error) => {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: error instanceof Error ? error.message : "ขออภัย ผู้ช่วยไม่สามารถตอบกลับได้ในขณะนี้"
        }
      ])
    }
  })

  async function submitPrompt(prompt: string) {
    const value = prompt.trim()
    if (!value) return

    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: `[${ASSISTANT_MODE_LABELS[mode]}] ${value}` }
    ])
    setInput("")
    await mutation.mutateAsync(value)
  }

  return (
    <>
      <button
        className="fixed bottom-4 right-4 z-[70] inline-flex h-14 items-center gap-3 rounded-full px-5 text-sm font-semibold text-white shadow-lg md:bottom-6 md:right-6"
        style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-strong) 100%)" }}
        onClick={() => setAssistantOpen(!assistantOpen)}
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/18">AI</span>
        ผู้ช่วยคลินิก
      </button>

      {assistantOpen ? (
        <div className="fixed inset-0 z-[80] md:inset-auto md:bottom-4 md:right-4 md:top-4 md:w-[min(460px,92vw)] xl:bottom-6 xl:right-6">
          <div className="absolute inset-0 bg-[#0f2738]/18 backdrop-blur-[2px] md:hidden" onClick={() => setAssistantOpen(false)} />
          <div
            className="absolute inset-x-0 bottom-0 top-[8%] flex flex-col rounded-t-[30px] border bg-white shadow-2xl md:inset-0 md:rounded-[32px]"
            style={{ borderColor: "var(--line)", boxShadow: "0 32px 60px rgba(18,52,76,0.18)" }}
          >
            <div className="flex items-start justify-between gap-4 border-b px-4 py-4 md:px-5 md:py-5" style={{ borderColor: "var(--line)" }}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--brand)" }}>
                  Gemini Assistant
                </p>
                <h3 className="mt-2 text-xl font-semibold">ผู้ช่วย AI สนับสนุนงาน HOSxP</h3>
                <p className="mt-1 text-sm leading-7" style={{ color: "var(--ink-muted)" }}>
                  ปรับตัวตามงานบริการ, Medical Scribe, Discharge / ICD, Paperless Audit และโหมดสนทนาเชิงสุขภาพจิต
                </p>
              </div>
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border"
                style={{ borderColor: "var(--line)", background: "var(--surface-strong)" }}
                onClick={() => setAssistantOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="border-b px-4 py-4 md:px-5" style={{ borderColor: "var(--line)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-muted)" }}>
                เลือกโหมดผู้ช่วย
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {(Object.keys(ASSISTANT_MODE_LABELS) as AssistantMode[]).map((key) => (
                  <button
                    key={key}
                    className="rounded-[20px] border px-3 py-3 text-left transition-colors"
                    style={
                      mode === key
                        ? { borderColor: "var(--brand)", background: "var(--brand-soft)" }
                        : { borderColor: "var(--line)", background: "var(--surface-strong)" }
                    }
                    onClick={() => setMode(key)}
                  >
                    <p className="text-sm font-semibold">{ASSISTANT_MODE_LABELS[key]}</p>
                    <p className="mt-1 text-xs leading-6" style={{ color: "var(--ink-muted)" }}>
                      {ASSISTANT_MODE_HINTS[key]}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-b px-4 py-4 md:px-5" style={{ borderColor: "var(--line)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--ink-muted)" }}>
                คำสั่งแนะนำ
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    className="rounded-full border px-3 py-2 text-xs font-medium"
                    style={{ borderColor: "var(--line)", background: "var(--page-bg-soft)", color: "var(--ink-soft)" }}
                    onClick={() => void submitPrompt(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 md:px-5 md:py-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="rounded-[22px] px-4 py-3"
                  style={
                    message.role === "assistant"
                      ? { background: "var(--page-bg-soft)", color: "var(--ink)" }
                      : { background: "var(--brand)", color: "white", marginLeft: "auto" }
                  }
                >
                  <p className="whitespace-pre-wrap text-sm leading-7">{message.content}</p>
                </div>
              ))}

              {mutation.isPending ? (
                <div className="rounded-[22px] bg-[var(--page-bg-soft)] px-4 py-3 text-sm" style={{ color: "var(--ink-muted)" }}>
                  ผู้ช่วยกำลังคิดคำตอบให้...
                </div>
              ) : null}
            </div>

            <div className="border-t px-4 py-4 md:px-5" style={{ borderColor: "var(--line)" }}>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="min-h-[110px] w-full rounded-[22px] border px-4 py-3 outline-none"
                style={{ borderColor: "var(--line)", background: "var(--surface-strong)" }}
                placeholder="วางโน้ตผู้ป่วย ข้อความสนทนา สรุป discharge หรือคำถามเชิง workflow ได้เลย"
              />
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs" style={{ color: "var(--ink-muted)" }}>
                  โหมด: {ASSISTANT_MODE_LABELS[mode]} • หน้า: {pageLabel}
                </p>
                <Button onClick={() => void submitPrompt(input)} loading={mutation.isPending}>
                  ส่งให้ผู้ช่วย
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
