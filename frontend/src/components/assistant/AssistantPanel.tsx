"use client"

import { useMemo, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { usePathname } from "next/navigation"

import { useAuthStore } from "@/store/authStore"
import { useUiStore } from "@/store/uiStore"
import { Button } from "../ui/Button"

type ChatMessage = {
  id: string
  role: "assistant" | "user"
  content: string
}

const quickPrompts = [
  "ช่วยสรุปงานสำคัญในเวรวันนี้ให้หน่อย",
  "ช่วยร่างข้อความโทรติดตามผู้ป่วยที่ขาดนัดอย่างสุภาพ",
  "ช่วยลำดับความสำคัญผู้ป่วยเสี่ยงจากหน้าปัจจุบัน",
  "ช่วยสรุปสิ่งที่พยาบาลควรเตรียมก่อนเริ่มคลินิก"
]

export function AssistantPanel() {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const assistantOpen = useUiStore((state) => state.assistantOpen)
  const setAssistantOpen = useUiStore((state) => state.setAssistantOpen)

  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "ผู้ช่วยพร้อมแล้ว สามารถช่วยสรุปคิว ชี้เคสเสี่ยง และร่างข้อความติดตามผู้ป่วยให้ได้"
    }
  ])

  const pageLabel = useMemo(() => {
    if (pathname?.startsWith("/appointments")) return "Appointment Operations"
    if (pathname?.startsWith("/noshow")) return "Outreach Board"
    if (pathname?.startsWith("/analytics")) return "Analytics"
    if (pathname?.startsWith("/patients/")) return "Patient Continuity Profile"
    return "Morning Command Center"
  }, [pathname])

  const mutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          page: pageLabel,
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
      { id: crypto.randomUUID(), role: "user", content: value }
    ])
    setInput("")
    await mutation.mutateAsync(value)
  }

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-[70] inline-flex h-14 items-center gap-3 rounded-full px-5 text-sm font-semibold text-white shadow-lg"
        style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-strong) 100%)" }}
        onClick={() => setAssistantOpen(!assistantOpen)}
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/18">AI</span>
        ผู้ช่วยคลินิก
      </button>

      {assistantOpen ? (
        <div
          className="fixed inset-y-4 right-4 z-[80] w-[92vw] max-w-[430px] rounded-[32px] border bg-white shadow-2xl"
          style={{ borderColor: "var(--line)", boxShadow: "0 32px 60px rgba(24,58,54,0.18)" }}
        >
          <div className="flex items-start justify-between gap-4 border-b px-5 py-5" style={{ borderColor: "var(--line)" }}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--brand)" }}>
                Gemini Assistant
              </p>
              <h3 className="mt-2 text-xl font-semibold">ผู้ช่วยส่วนตัวประจำคลินิก</h3>
              <p className="mt-1 text-sm leading-7" style={{ color: "var(--ink-muted)" }}>
                ช่วยสรุปงาน ร่างข้อความติดตาม และลำดับความสำคัญจากหน้าที่กำลังใช้งาน
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

          <div className="border-b px-5 py-4" style={{ borderColor: "var(--line)" }}>
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

          <div className="max-h-[48vh] space-y-3 overflow-y-auto px-5 py-5">
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

          <div className="border-t px-5 py-4" style={{ borderColor: "var(--line)" }}>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="min-h-[110px] w-full rounded-[22px] border px-4 py-3 outline-none"
              style={{ borderColor: "var(--line)", background: "var(--surface-strong)" }}
              placeholder="เช่น ช่วยสรุปผู้ป่วยที่ต้องติดตามก่อน 10 โมง หรือช่วยร่างข้อความโทรติดตามผู้ป่วยให้หน่อย"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs" style={{ color: "var(--ink-muted)" }}>
                หน้าปัจจุบัน: {pageLabel}
              </p>
              <Button onClick={() => void submitPrompt(input)} loading={mutation.isPending}>
                ส่งให้ผู้ช่วย
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
