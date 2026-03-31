"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useAuthStore } from "../store/authStore"

// ─── Schema ───────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email:    z.string().email("กรุณากรอกอีเมลให้ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน")
})
type LoginForm = z.infer<typeof loginSchema>

type Role = "จิตแพทย์" | "นักจิตวิทยา" | "ผู้ป่วย"
const ROLES: Role[] = ["จิตแพทย์", "นักจิตวิทยา", "ผู้ป่วย"]

// ─── Background Particle Canvas ──────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    type Particle = { x: number; y: number; r: number; dx: number; dy: number; alpha: number }
    const particles: Particle[] = Array.from({ length: 45 }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 2 + 0.5,
      dx:    (Math.random() - 0.5) * 0.3,
      dy:    (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.4 + 0.1
    }))

    let raf: number
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.dx; p.y += p.dy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(167, 139, 250, ${p.alpha})`
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
}

// ─── Logo Component ──────────────────────────────────────────────────────────
function MindCareLogo() {
  return (
    <div className="flex flex-col items-center gap-4 animate-entrance">
      <div className="w-20 h-20 rounded-[28px] glass border-primary/40 flex items-center justify-center relative group">
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary relative z-10">
          <path d="M12 4.5C7.5 4.5 3.5 8.5 3.5 13C3.5 17.5 7.5 21.5 12 21.5C16.5 21.5 20.5 17.5 20.5 13" strokeLinecap="round" />
          <path d="M12 4.5C14 4.5 15.5 6 15.5 8C15.5 10 14 11.5 12 11.5C10 11.5 8.5 10 8.5 8C8.5 6 10 4.5 12 4.5Z" />
          <path d="M12 11.5V16.5" strokeLinecap="round" />
          <path d="M9 14.5H15" strokeLinecap="round" />
        </svg>
      </div>
      <div className="text-center">
        <h1 className="text-4xl text-glow tracking-tighter">MindCare</h1>
        <p className="text-muted text-sm mt-1 font-medium tracking-wide">NimittHIS Psychiatric System</p>
      </div>
    </div>
  )
}

// ─── Main LoginPage Component ────────────────────────────────────────────────
export function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const loginAction = useAuthStore((s) => s.loginAction)
  const registerAction = useAuthStore((s) => s.registerAction)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  
  const [activeRole, setActiveRole] = useState<Role>("จิตแพทย์")
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "nurse01@nimitthis.local", password: "nurse123" }
  })

  useEffect(() => {
    if (isAuthenticated) router.replace(searchParams?.get("next") || "/dashboard")
  }, [isAuthenticated, router, searchParams])

  const mutation = useMutation({
    mutationFn: (v: LoginForm) => isRegisterMode ? registerAction(v) : loginAction(v),
    onSuccess: () => {
      if (isRegisterMode) alert("ลงทะเบียนสำเร็จแล้ว!")
      router.replace(searchParams?.get("next") || "/dashboard")
    }
  })

  return (
    <main className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <ParticleCanvas />
      
      {/* Aurora Ambient Glows */}
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-[600px] h-[600px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 flex flex-col gap-10">
        <MindCareLogo />

        <div className="glass p-8 rounded-[40px] animate-entrance [animation-delay:200ms]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">{isRegisterMode ? "สร้างบัญชีใหม่" : "ยินดีต้อนรับกลับมา"}</h2>
            <p className="text-muted text-sm mt-1">กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบนิมิต</p>
          </div>

          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-5">
            {/* Role Selection */}
            <div className="p-1 glass-light rounded-2xl flex gap-1">
              {ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setActiveRole(role)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all tap-active ${
                    activeRole === role ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-muted hover:text-white"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted ml-1 uppercase tracking-widest">Username / Email</label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="name@hospital.local"
                  className="w-full h-13 px-5 glass-light border-white/5 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-2xl outline-none transition-all placeholder:text-subtle"
                />
                {formState.errors.email && <p className="text-danger text-[10px] ml-1">{formState.errors.email.message}</p>}
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-[11px] font-bold text-muted ml-1 uppercase tracking-widest">Password</label>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full h-13 px-5 glass-light border-white/5 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-2xl outline-none transition-all placeholder:text-subtle"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 bottom-3 text-subtle hover:text-primary transition-colors"
                >
                  {showPassword ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
                {formState.errors.password && <p className="text-danger text-[10px] ml-1">{formState.errors.password.message}</p>}
              </div>
            </div>

            {mutation.isError && (
              <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl flex items-center gap-2 text-danger text-xs animate-entrance">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
              </div>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full h-14 bg-gradient-to-r from-primary to-violet-600 rounded-2xl font-bold text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 tap-active disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {mutation.isPending ? "กำลังตรวจสอบ..." : isRegisterMode ? "สร้างบัญชีผู้ใช้งาน" : "เข้าสู่ระบบเพื่อใช้งาน"}
              {!mutation.isPending && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
            </button>
          </form>

          <footer className="mt-8 flex flex-col items-center gap-4">
            <button
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-xs text-muted hover:text-primary transition-colors font-medium"
            >
              {isRegisterMode ? "มีบัญชีอยู่แล้ว? เข้าสู่ระบบ" : "ยังไม่มีบัญชีใช่หรือไม่? สร้างบัญชีใหม่"}
            </button>
            <div className="flex items-center gap-2 text-[10px] text-subtle opacity-50 uppercase tracking-[0.2em]">
              <div className="w-8 h-[1px] bg-current" />
              MindCare Secure Platform
              <div className="w-8 h-[1px] bg-current" />
            </div>
          </footer>
        </div>
      </div>
    </main>
  )
}

