"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "../components/ui/Button"
import { useAuthStore } from "../store/authStore"

const loginSchema = z.object({
  email: z.string().email("กรุณากรอกอีเมลให้ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน")
})

type LoginForm = z.infer<typeof loginSchema>

const FEATURES = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    title: "เสี่ยงสูง",
    detail: "คัดลำดับ no-show score อัตโนมัติ"
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Timeline",
    detail: "ประวัติการติดตามแบบ audit trail"
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: "Analytics",
    detail: "สรุปผลตามคลินิกและช่วงเวลา"
  }
]

export function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const loginAction = useAuthStore((state) => state.loginAction)
  const registerAction = useAuthStore((state) => state.registerAction)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const nextPath = searchParams?.get("next") || "/dashboard"

  const { register, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "nurse01@nimitthis.local",
      password: "nurse123"
    }
  })

  const mutation = useMutation({
    mutationFn: (values: LoginForm) => isRegisterMode ? registerAction(values) : loginAction(values),
    onSuccess: () => {
      if (isRegisterMode) {
        alert("สร้างบัญชีสำเร็จ! (หากขึ้น Error ติดต่อฐานข้อมูล ให้ตรวจสอบการตั้งค่า Email ยืนยันใน Supabase)")
      }
      router.replace(nextPath)
    }
  })

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(nextPath)
    }
  }, [isAuthenticated, nextPath, router])

  return (
    <main className="flex min-h-screen items-center justify-center bg-nimitt-bg px-4 py-8">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-nimitt-blue/8 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-nimitt-teal/6 blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl animate-slide-up">
        <div className="overflow-hidden rounded-[32px] border border-white/60 shadow-panel-md lg:grid lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left — brand panel */}
          <section className="relative overflow-hidden bg-[#0d0d0c] px-8 py-10 text-white md:px-12 md:py-14">
            {/* Subtle gradient overlay */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-nimitt-blue/15 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-nimitt-teal/10 blur-2xl" />
            </div>

            <div className="relative">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-nimitt-blue shadow-md">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/50">NimittHIS</p>
              </div>

              <h1 className="mt-6 max-w-lg text-4xl font-semibold leading-tight">
                แพลตฟอร์มติดตามนัดหมายผู้ป่วยสำหรับโรงพยาบาลไทย
              </h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-white/60">
                มองเห็นผู้ป่วยเสี่ยงขาดนัด ตรวจ timeline ย้อนหลัง และสรุปภาพรวมได้ในระบบเดียว
              </p>

              {/* Feature cards */}
              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {FEATURES.map(({ icon, title, detail }, i) => (
                  <div
                    key={title}
                    className="animate-slide-up rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:bg-white/8"
                    style={{ animationDelay: `${200 + i * 80}ms` }}
                  >
                    <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-xl bg-nimitt-blue/20 text-nimitt-blue">
                      {icon}
                    </div>
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="mt-1.5 text-xs leading-5 text-white/55">{detail}</p>
                  </div>
                ))}
              </div>

              {/* Version tag */}
              <p className="mt-8 text-xs text-white/30">v2.0 · Thai Hospital Operations</p>
            </div>
          </section>

          {/* Right — login form */}
          <section className="flex items-center bg-nimitt-surface px-6 py-10 md:px-10">
            <form
              className="w-full space-y-5 animate-slide-up"
              style={{ animationDelay: "150ms" }}
              onSubmit={handleSubmit((values) => mutation.mutate(values))}
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-nimitt-faint">
                  {isRegisterMode ? "ลงทะเบียนแอดมิน" : "เข้าสู่ระบบ"}
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-nimitt-ink">
                  {isRegisterMode ? "สร้างบัญชีผู้ใช้งานใหม่" : "เริ่มต้นเวรวันนี้"}
                </h2>
                <p className="mt-1 text-sm text-nimitt-muted">
                  {isRegisterMode ? "กรอกอีเมลและตั้งรหัสผ่านที่ต้องการ" : "กรอกข้อมูลเพื่อเข้าใช้งานระบบ"}
                </p>
              </div>

              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-nimitt-ink">อีเมล</span>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full rounded-2xl border border-nimitt-border bg-nimitt-bg px-4 py-3 text-sm outline-none transition focus:border-nimitt-blue focus:bg-white focus:ring-2 focus:ring-nimitt-blue/20"
                  placeholder="example@hospital.go.th"
                />
                {formState.errors.email && (
                  <span className="text-xs text-nimitt-red">{formState.errors.email.message}</span>
                )}
              </label>

              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-nimitt-ink">รหัสผ่าน</span>
                <input
                  type="password"
                  {...register("password")}
                  className="w-full rounded-2xl border border-nimitt-border bg-nimitt-bg px-4 py-3 text-sm outline-none transition focus:border-nimitt-blue focus:bg-white focus:ring-2 focus:ring-nimitt-blue/20"
                  placeholder="••••••••"
                />
                {formState.errors.password && (
                  <span className="text-xs text-nimitt-red">{formState.errors.password.message}</span>
                )}
              </label>

              {mutation.isError && (
                <div className="flex items-start gap-2.5 rounded-2xl border border-nimitt-red/20 bg-nimitt-red-bg px-4 py-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0 text-nimitt-red">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span className="text-sm text-nimitt-red">
                    {isRegisterMode 
                      ? "สร้างบัญชีไม่สำเร็จ (อีเมลอาจจะซ้ำ หรือห้ามใช้นามสกุล .local)"
                      : "เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลและรหัสผ่านอีกครั้ง"}
                  </span>
                </div>
              )}

              <Button type="submit" fullWidth size="lg" loading={mutation.isPending}>
                {mutation.isPending 
                  ? (isRegisterMode ? "กำลังสร้างบัญชี..." : "กำลังเข้าสู่ระบบ...") 
                  : (isRegisterMode ? "สร้างบัญชีผู้ใช้งาน" : "เข้าสู่ระบบ")}
              </Button>

              <div className="mt-4 text-center text-sm text-nimitt-muted">
                {isRegisterMode ? "มีบัญชีอยู่แล้ว? " : "ยังไม่มีบัญชีใช่หรือไม่? "}
                <button 
                  type="button" 
                  onClick={() => setIsRegisterMode(!isRegisterMode)} 
                  className="font-semibold text-nimitt-blue hover:underline"
                >
                  {isRegisterMode ? "เข้าสู่ระบบที่นี่" : "สร้างบัญชีใหม่"}
                </button>
              </div>

              <p className="text-center text-xs text-nimitt-faint mt-4">
                ระบบนี้สงวนสิทธิ์สำหรับบุคลากรโรงพยาบาลที่ได้รับอนุญาตเท่านั้น
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}
