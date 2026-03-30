"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAuthStore } from "../store/authStore"

const loginSchema = z.object({
  email: z.string().email("กรุณากรอกอีเมลให้ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน")
})
type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { loginAction } = useAuthStore()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "nurse01@nimitthis.local", password: "password" }
  })

  const mutation = useMutation({
    mutationFn: (data: LoginForm) => loginAction({ email: data.email, password: data.password }),
    onSuccess: () => {
      const next = searchParams.get("next") ?? "/dashboard"
      router.replace(next)
    }
  })

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center gap-12 px-4 py-16"
      style={{ background: "#030712" }}
    >
      {/* Aurora */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute rounded-full" style={{ width:900,height:900,top:-300,left:-150,background:"radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",animation:"auroraA 22s ease-in-out infinite alternate" }}/>
        <div className="absolute rounded-full" style={{ width:700,height:700,bottom:-150,right:-150,background:"radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)",animation:"auroraB 28s ease-in-out infinite alternate" }}/>
      </div>
      <div className="pointer-events-none fixed inset-0" aria-hidden style={{ backgroundImage:"linear-gradient(rgba(99,179,237,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,0.025) 1px,transparent 1px)",backgroundSize:"40px 40px" }}/>

      {/* Hero */}
      <div className="relative z-10 text-center max-w-xl" style={{ animation:"fadeUp 0.6s ease both" }}>
        <div className="flex items-center justify-center gap-3 mb-7">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background:"linear-gradient(135deg,#7c3aed,#22d3ee)",boxShadow:"0 0 32px rgba(124,58,237,0.45)" }}>⚕️</div>
          <span className="font-mono text-xl font-bold tracking-[0.2em]" style={{ background:"linear-gradient(90deg,#a78bfa,#22d3ee)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>NIMITTHIS</span>
        </div>
        <span className="inline-block font-mono text-[11px] text-cyan-400 border border-cyan-500/30 rounded-full px-3.5 py-1 mb-5 tracking-widest">v2.0 · Thai Hospital Intelligence System</span>
        <h1 className="font-mono text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
          แพลตฟอร์มติดตาม<br/>
          <span style={{ background:"linear-gradient(135deg,#a78bfa 0%,#22d3ee 55%,#10b981 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>นัดหมายผู้ป่วย</span>
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">มองเห็นผู้ป่วยเสี่ยงขาดนัด ตรวจ Timeline ย้อนหลัง และสรุปภาพรวมได้ในระบบเดียว</p>
      </div>

      {/* Login Card */}
      <form
        onSubmit={handleSubmit((d) => mutation.mutate(d))}
        className="relative z-10 w-full max-w-sm rounded-2xl p-9"
        style={{
          background:"rgba(12,26,60,0.65)",
          backdropFilter:"blur(24px)",
          border:"1px solid rgba(99,179,237,0.18)",
          boxShadow:"0 40px 80px rgba(0,0,0,0.5)",
          animation:"fadeUp 0.6s 0.15s ease both",
        }}
      >
        {/* Top shimmer */}
        <div className="absolute top-0 inset-x-0 h-px rounded-t-2xl" style={{ background:"linear-gradient(90deg,transparent,#a78bfa,#22d3ee,transparent)" }}/>

        <p className="font-mono text-[11px] text-violet-400 tracking-[0.15em] uppercase mb-1">เข้าสู่ระบบ</p>
        <h2 className="font-mono text-2xl font-bold mb-1 text-slate-100">เริ่มต้นเวรวันนี้</h2>
        <p className="text-sm text-slate-400 mb-7">กรอกข้อมูลเพื่อเข้าใช้งานระบบ</p>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-xs text-slate-400 font-medium mb-1.5">อีเมล</label>
          <input
            {...register("email")}
            type="email"
            className="w-full px-4 py-3 rounded-xl text-slate-100 text-sm outline-none transition-all placeholder:text-slate-600"
            style={{ background:"rgba(6,13,31,0.8)", border:"1px solid rgba(99,179,237,0.2)" }}
            placeholder="nurse01@hospital.local"
          />
          {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="mb-7">
          <label className="block text-xs text-slate-400 font-medium mb-1.5">รหัสผ่าน</label>
          <input
            {...register("password")}
            type="password"
            className="w-full px-4 py-3 rounded-xl text-slate-100 text-sm outline-none transition-all placeholder:text-slate-600"
            style={{ background:"rgba(6,13,31,0.8)", border:"1px solid rgba(99,179,237,0.2)" }}
            placeholder="••••••••"
          />
          {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>}
        </div>

        {mutation.isError && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm text-rose-400" style={{ background:"rgba(244,63,94,0.1)", border:"1px solid rgba(244,63,94,0.25)" }}>
            อีเมลหรือรหัสผ่านไม่ถูกต้อง
          </div>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-3.5 rounded-xl font-mono text-base font-semibold tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
          style={{ background:"linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow:"0 4px 20px rgba(124,58,237,0.3)" }}
        >
          {mutation.isPending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ →"}
        </button>

        <p className="text-center text-[11px] text-slate-600 mt-5">
          ระบบนี้สงวนสิทธิ์สำหรับบุคลากรโรงพยาบาลที่ได้รับอนุญาตเท่านั้น
        </p>
      </form>

      <style jsx global>{`
        @keyframes auroraA { from{transform:translate(0,0)} to{transform:translate(120px,90px)} }
        @keyframes auroraB { from{transform:translate(0,0)} to{transform:translate(-90px,-70px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}
