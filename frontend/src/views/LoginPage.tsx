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

// ─── Floating Particles (canvas) ──────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    type Particle = { x: number; y: number; r: number; dx: number; dy: number; alpha: number }

    const COUNT = 55
    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.5 + 0.3,
      dx:    (Math.random() - 0.5) * 0.22,
      dy:    (Math.random() - 0.5) * 0.22,
      alpha: Math.random() * 0.35 + 0.05
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
        ctx.fillStyle = `rgba(167,139,250,${p.alpha})`
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}

// ─── Brain + Wave icon ─────────────────────────────────────────────────────────
function BrainIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
      {/* Brain outline simplified */}
      <path
        d="M20 8c-2.5 0-4.5 1.2-5.8 3-1.2-.5-2.7-.3-3.7.8-1 1-1.2 2.5-.7 3.7C8.2 16.8 7 18.8 7 21c0 3.3 2.7 6 6 6h1v2.5c0 .8.7 1.5 1.5 1.5h9c.8 0 1.5-.7 1.5-1.5V27h1c3.3 0 6-2.7 6-6 0-2.2-1.2-4.2-3-5.3.5-1.2.3-2.7-.7-3.7-1-1-2.5-1.2-3.7-.7C25 9.2 22.8 8 20 8z"
        fill="white"
        fillOpacity="0.9"
      />
      {/* Heartbeat wave inside */}
      <path
        d="M11 21h3.5l2-4 3 8 2-10 2 6H31"
        stroke="url(#waveGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <defs>
        <linearGradient id="waveGrad" x1="11" y1="21" x2="31" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a78bfa"/>
          <stop offset="1" stopColor="#2dd4bf"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

// ─── Main LoginPage ────────────────────────────────────────────────────────────
export function LoginPage() {
  const router         = useRouter()
  const searchParams   = useSearchParams()
  const loginAction    = useAuthStore((s) => s.loginAction)
  const registerAction = useAuthStore((s) => s.registerAction)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const nextPath = searchParams?.get("next") || "/dashboard"

  const [activeRole, setActiveRole]         = useState<Role>("จิตแพทย์")
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [focusedField, setFocusedField]     = useState<"email" | "password" | null>(null)
  const [showPassword, setShowPassword]     = useState(false)

  const { register, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "nurse01@nimitthis.local", password: "nurse123" }
  })

  const mutation = useMutation({
    mutationFn: (v: LoginForm) => isRegisterMode ? registerAction(v) : loginAction(v),
    onSuccess: () => {
      if (isRegisterMode) alert("สร้างบัญชีสำเร็จ!")
      router.replace(nextPath)
    }
  })

  useEffect(() => { if (isAuthenticated) router.replace(nextPath) }, [isAuthenticated, nextPath, router])

  // ── Input style helper ──────────────────────────────────────────────────────
  const inputStyle = (field: "email" | "password"): React.CSSProperties => ({
    width: "100%",
    padding: "13px 16px 13px 52px",
    background: focusedField === field ? "rgba(167,139,250,0.09)" : "rgba(255,255,255,0.07)",
    border: `1px solid ${focusedField === field ? "rgba(167,139,250,0.60)" : "rgba(167,139,250,0.22)"}`,
    borderRadius: "18px",
    color: "#f1f5f9",
    fontFamily: "'Sarabun', sans-serif",
    fontSize: "15px",
    outline: "none",
    boxShadow: focusedField === field ? "0 0 0 3px rgba(167,139,250,0.14), 0 0 20px rgba(167,139,250,0.18)" : "none",
    transition: "all 0.2s ease"
  })

  return (
    <main
      className="flex min-h-screen items-end justify-center overflow-hidden"
      style={{ background: "#080a14" }}
    >
      {/* ── Full-screen background ─────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Particles */}
        <ParticleCanvas />

        {/* Aurora glow — center */}
        <div style={{
          position: "absolute", top: "6%", left: "50%",
          transform: "translateX(-50%)",
          width: "520px", height: "420px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(124,58,237,0.28) 0%, rgba(167,139,250,0.10) 40%, transparent 70%)",
          filter: "blur(2px)"
        }} />

        {/* Bottom dark fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "58%",
          background: "linear-gradient(to top, #080a14 55%, transparent 100%)"
        }} />
      </div>

      {/* ── Hero logo area ─────────────────────────────────────────────── */}
      <div className="absolute" style={{ top: "7%", left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
        {/* Circle icon */}
        <div style={{
          width: 88, height: 88,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(167,139,250,0.25) 0%, rgba(45,212,191,0.18) 100%)",
          border: "1.5px solid rgba(167,139,250,0.40)",
          boxShadow: "0 0 40px rgba(167,139,250,0.45), 0 0 80px rgba(124,58,237,0.20)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "glowPulse 3s ease-in-out infinite"
        }}>
          <div style={{
            width: 66, height: 66, borderRadius: "50%",
            background: "linear-gradient(135deg, #a78bfa 0%, #2dd4bf 100%)",
            boxShadow: "0 0 24px rgba(167,139,250,0.50)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <BrainIcon />
          </div>
        </div>

        {/* App name */}
        <div style={{ textAlign: "center" }}>
          <h1 style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "42px", fontWeight: 700,
            color: "#f1f5f9",
            letterSpacing: "0.03em",
            lineHeight: 1,
            textShadow: "0 0 30px rgba(167,139,250,0.50)"
          }}>
            MindCare
          </h1>
          <p style={{
            marginTop: "8px",
            fontFamily: "'Sarabun', sans-serif",
            fontSize: "14px",
            color: "#94a3b8",
            fontWeight: 400,
            letterSpacing: "0.01em"
          }}>
            ดูแลสุขภาพจิต ใส่ใจทุกความรู้สึก
          </p>
        </div>
      </div>

      {/* ── Bottom form panel ─────────────────────────────────────────── */}
      <div
        className="relative w-full"
        style={{
          maxWidth: "440px",
          background: "rgba(13,15,26,0.82)",
          backdropFilter: "blur(28px) saturate(120%)",
          WebkitBackdropFilter: "blur(28px) saturate(120%)",
          borderTop: "1px solid rgba(167,139,250,0.18)",
          borderRadius: "32px 32px 0 0",
          padding: "28px 24px 36px",
          boxShadow: "0 -24px 80px rgba(13,15,26,0.70)"
        }}
      >
        {/* Section label */}
        <h2 style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "22px", fontWeight: 700,
          color: "#f1f5f9",
          marginBottom: "20px"
        }}>
          {isRegisterMode ? "ลงทะเบียน" : "เข้าสู่ระบบ"}
        </h2>

        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

          {/* ── Email input ─────────────────────────────────────────────── */}
          <div style={{ position: "relative" }}>
            {/* Icon bg pill */}
            <div style={{
              position: "absolute", left: "6px", top: "50%", transform: "translateY(-50%)",
              width: "36px", height: "36px", borderRadius: "12px",
              background: "linear-gradient(135deg, rgba(167,139,250,0.25), rgba(124,58,237,0.25))",
              border: "1px solid rgba(167,139,250,0.30)",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 1
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <input
              {...register("email")}
              type="email"
              placeholder="ชื่อผู้ใช้ / อีเมล"
              style={inputStyle("email")}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
            />
            {formState.errors.email && (
              <p style={{ marginTop: "4px", fontSize: "11px", color: "#f43f5e", paddingLeft: "4px" }}>
                {formState.errors.email.message}
              </p>
            )}
          </div>

          {/* ── Password input ──────────────────────────────────────────── */}
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", left: "6px", top: "50%", transform: "translateY(-50%)",
              width: "36px", height: "36px", borderRadius: "12px",
              background: "linear-gradient(135deg, rgba(167,139,250,0.25), rgba(124,58,237,0.25))",
              border: "1px solid rgba(167,139,250,0.30)",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 1
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </div>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="รหัสผ่าน"
              style={{ ...inputStyle("password"), paddingRight: "44px" }}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
            />
            {/* Show/Hide toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "#64748b", padding: 0
              }}
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
            {formState.errors.password && (
              <p style={{ marginTop: "4px", fontSize: "11px", color: "#f43f5e", paddingLeft: "4px" }}>
                {formState.errors.password.message}
              </p>
            )}
          </div>

          {/* ── Role selector ──────────────────────────────────────────── */}
          <div style={{ display: "flex", gap: "8px", padding: "2px 0" }}>
            {ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setActiveRole(role)}
                style={{
                  flex: 1,
                  padding: "9px 4px",
                  borderRadius: "14px",
                  fontSize: "12px",
                  fontFamily: "'Sarabun', sans-serif",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: activeRole === role ? "1px solid transparent" : "1px solid rgba(167,139,250,0.25)",
                  background: activeRole === role
                    ? "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)"
                    : "rgba(255,255,255,0.05)",
                  color: activeRole === role ? "#fff" : "#94a3b8",
                  boxShadow: activeRole === role ? "0 0 16px rgba(167,139,250,0.35)" : "none"
                }}
              >
                {role}
              </button>
            ))}
          </div>

          {/* ── Error ──────────────────────────────────────────────────── */}
          {mutation.isError && (
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 14px", borderRadius: "14px",
              background: "rgba(244,63,94,0.10)", border: "1px solid rgba(244,63,94,0.28)"
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span style={{ fontSize: "13px", color: "#f43f5e", fontFamily: "'Sarabun',sans-serif" }}>
                เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง
              </span>
            </div>
          )}

          {/* ── CTA Button ─────────────────────────────────────────────── */}
          <button
            type="submit"
            disabled={mutation.isPending}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "20px",
              background: mutation.isPending
                ? "rgba(167,139,250,0.4)"
                : "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
              border: "none",
              color: "#fff",
              fontFamily: "'Sarabun', sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              cursor: mutation.isPending ? "not-allowed" : "pointer",
              boxShadow: "0 0 28px rgba(167,139,250,0.40), 0 8px 32px rgba(124,58,237,0.30)",
              transition: "all 0.2s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              marginTop: "4px"
            }}
          >
            {mutation.isPending ? (
              <>
                <svg style={{ animation: "spin 1s linear infinite" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              <>
                เข้าสู่ระบบ
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* ── Below-button links ─────────────────────────────────────── */}
        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Sarabun',sans-serif", fontSize: "13px", color: "#2dd4bf", fontWeight: 500 }}
          >
            ลืมรหัสผ่าน?
          </button>

          <p style={{ fontFamily: "'Sarabun',sans-serif", fontSize: "13px", color: "#94a3b8" }}>
            ยังไม่มีบัญชี?{" "}
            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#2dd4bf", fontWeight: 600, fontSize: "13px", fontFamily: "'Sarabun',sans-serif" }}
            >
              ลงทะเบียน
            </button>
          </p>
        </div>

        {/* ── Privacy note ───────────────────────────────────────────── */}
        <div style={{
          marginTop: "20px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <p style={{ fontFamily: "'Sarabun',sans-serif", fontSize: "11px", color: "#475569", textAlign: "center" }}>
            ระบบรักษาความลับข้อมูลผู้ป่วย 100%
          </p>
        </div>
      </div>

      {/* ── Keyframes ──────────────────────────────────────────────────── */}
      <style>{`
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 40px rgba(167,139,250,0.45), 0 0 80px rgba(124,58,237,0.20); }
          50%      { box-shadow: 0 0 60px rgba(167,139,250,0.70), 0 0 100px rgba(124,58,237,0.35); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  )
}
