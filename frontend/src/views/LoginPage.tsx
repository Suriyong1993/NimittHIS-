"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useAuthStore } from "../store/authStore"

const loginSchema = z.object({
  email: z.string().email("กรุณากรอกอีเมลให้ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน")
})

type LoginForm = z.infer<typeof loginSchema>
type Role = "แพทย์" | "พยาบาล" | "ผู้ดูแลระบบ"

const ROLE_COPY: Record<Role, { title: string; note: string }> = {
  "แพทย์": {
    title: "Clinical Review",
    note: "ดู continuity summary, risk alert และนัดติดตามในมุมมองเดียว"
  },
  "พยาบาล": {
    title: "Care Coordination",
    note: "จัด flow คิว ตรวจสอบการมาตามนัด และปิดงาน outreach ได้เร็วขึ้น"
  },
  "ผู้ดูแลระบบ": {
    title: "Operations Overview",
    note: "มองภาพรวมการทำงาน รายงาน และการกำกับคุณภาพของระบบ"
  }
}

const TRUST_POINTS = [
  "เชื่อมข้อมูลนัดหมายและการติดตามในมุมมองเดียว",
  "รองรับ AI assistant สำหรับหน้างานคลินิกและผู้ป่วย",
  "ออกแบบให้ใช้ได้ลื่นทั้ง desktop, tablet และมือถือ"
]

export function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const loginAction = useAuthStore((s) => s.loginAction)
  const registerAction = useAuthStore((s) => s.registerAction)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const [activeRole, setActiveRole] = useState<Role>("พยาบาล")
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "nurse01@nimitthis.local", password: "nurse123" }
  })

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(searchParams?.get("next") || "/dashboard")
    }
  }, [isAuthenticated, router, searchParams])

  const mutation = useMutation({
    mutationFn: (values: LoginForm) => (isRegisterMode ? registerAction(values) : loginAction(values)),
    onSuccess: () => {
      router.replace(searchParams?.get("next") || "/dashboard")
    }
  })

  const roleCopy = ROLE_COPY[activeRole]

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 md:px-6 md:py-8">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 12% 18%, rgba(95,168,211,0.22), transparent 24%), radial-gradient(circle at 88% 14%, rgba(44,159,133,0.16), transparent 22%), radial-gradient(circle at 82% 82%, rgba(217,145,55,0.11), transparent 20%)"
        }}
      />

      <div className="page-shell relative z-10 grid min-h-[calc(100vh-3rem)] items-center gap-5 xl:grid-cols-[minmax(0,1.08fr)_520px]">
        <section className="section-card soft-grid overflow-hidden px-5 py-6 md:px-7 md:py-7 xl:px-8 xl:py-8">
          <div className="max-w-3xl">
            <span className="eyebrow">NimittHIS • MindCare</span>
            <h1 className="mt-5 text-[34px] font-semibold leading-tight tracking-[-0.05em] md:text-[48px] xl:text-[56px]">
              ระบบติดตามนัดหมายและการดูแลสุขภาพจิต
              <span className="block" style={{ color: "var(--brand)" }}>
                ที่ช่วยให้ทีมรักษาทำงานง่ายขึ้น
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-8 md:text-[16px]" style={{ color: "var(--ink-muted)" }}>
              ออกแบบสำหรับคลินิกจิตเวช โรงพยาบาล และทีมสหวิชาชีพ ที่ต้องดูทั้งคิวตรวจ งานติดตามขาดนัด continuity of care และการสื่อสารระหว่างทีมในระบบเดียว
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {TRUST_POINTS.map((item, index) => (
                <div key={item} className="soft-block px-4 py-4">
                  <div
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{
                      background:
                        index === 0
                          ? "var(--brand)"
                          : index === 1
                            ? "var(--accent)"
                            : "var(--success)"
                    }}
                  >
                    {index + 1}
                  </div>
                  <p className="mt-3 text-sm leading-7">{item}</p>
                </div>
              ))}
            </div>

            <div className="surface-strong rounded-[30px] p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--brand)" }}>
                ผู้ใช้หลักของระบบ
              </p>
              <div className="mt-4 space-y-2">
                {(Object.keys(ROLE_COPY) as Role[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    className="w-full rounded-[20px] border px-4 py-4 text-left transition-colors"
                    style={
                      activeRole === role
                        ? { background: "var(--brand-soft)", borderColor: "var(--brand)" }
                        : { background: "var(--surface-strong)", borderColor: "var(--line)" }
                    }
                    onClick={() => setActiveRole(role)}
                  >
                    <p className="text-sm font-semibold">{role}</p>
                    <p className="mt-1 text-xs leading-6" style={{ color: "var(--ink-muted)" }}>
                      {ROLE_COPY[role].title}
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-[22px] bg-[var(--page-bg-soft)] px-4 py-4">
                <p className="text-sm font-semibold">{roleCopy.title}</p>
                <p className="mt-2 text-sm leading-7" style={{ color: "var(--ink-muted)" }}>
                  {roleCopy.note}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-card px-5 py-6 md:px-7 md:py-7">
          <div className="panel-head">
            <div>
              <span className="eyebrow">{isRegisterMode ? "Create Account" : "Secure Login"}</span>
              <h2 className="mt-4 text-[28px] font-semibold tracking-[-0.04em]">
                {isRegisterMode ? "สร้างบัญชีสำหรับเริ่มใช้งาน" : "เข้าสู่ระบบเพื่อเริ่มเวรวันนี้"}
              </h2>
              <p className="mt-2 text-sm leading-7" style={{ color: "var(--ink-muted)" }}>
                {isRegisterMode
                  ? "ใช้สำหรับสร้างบัญชีผู้ใช้ในระบบทดสอบหรือสภาพแวดล้อมเริ่มต้น"
                  : "กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่แดชบอร์ดของ NimittHIS"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="mt-6 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--ink-muted)" }}>
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="name@hospital.local"
                className="h-14 w-full rounded-[20px] border bg-white px-4 outline-none transition-colors"
                style={{ borderColor: "var(--line)" }}
              />
              {formState.errors.email ? (
                <p className="text-xs" style={{ color: "var(--danger)" }}>
                  {formState.errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--ink-muted)" }}>
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="กรอกรหัสผ่าน"
                  className="h-14 w-full rounded-[20px] border bg-white px-4 pr-14 outline-none transition-colors"
                  style={{ borderColor: "var(--line)" }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full"
                  style={{ background: "var(--page-bg-soft)", color: "var(--ink-soft)" }}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {formState.errors.password ? (
                <p className="text-xs" style={{ color: "var(--danger)" }}>
                  {formState.errors.password.message}
                </p>
              ) : null}
            </div>

            {mutation.isError ? (
              <div
                className="rounded-[20px] border px-4 py-3 text-sm"
                style={{ background: "var(--danger-soft)", borderColor: "rgba(211,93,110,0.18)", color: "var(--danger)" }}
              >
                เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลหรือรหัสผ่านอีกครั้ง
              </div>
            ) : null}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-[20px] px-5 text-sm font-semibold text-white transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-strong) 100%)" }}
            >
              {mutation.isPending
                ? isRegisterMode
                  ? "กำลังสร้างบัญชี..."
                  : "กำลังตรวจสอบ..."
                : isRegisterMode
                  ? "สร้างบัญชีผู้ใช้งาน"
                  : "เข้าสู่ระบบ"}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-4">
            <button
              type="button"
              className="text-sm font-medium"
              style={{ color: "var(--brand)" }}
              onClick={() => setIsRegisterMode((current) => !current)}
            >
              {isRegisterMode ? "มีบัญชีอยู่แล้ว? เข้าสู่ระบบ" : "ยังไม่มีบัญชี? สร้างบัญชีใหม่"}
            </button>

            <div className="rounded-[24px] border bg-[var(--page-bg-soft)] px-4 py-4" style={{ borderColor: "var(--line)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--ink-muted)" }}>
                Demo Access
              </p>
              <p className="mt-2 text-sm leading-7" style={{ color: "var(--ink-muted)" }}>
                ค่าเริ่มต้นในระบบทดสอบใช้บัญชีตัวอย่างของทีมพยาบาล เพื่อให้คุณเปิดดู flow ได้ทันทีหลังเข้าสู่ระบบ
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
