import type { CSSProperties, PropsWithChildren } from "react"

interface CardProps {
  className?: string
  style?:     CSSProperties
}

export function Card({ children, className = "", style }: PropsWithChildren<CardProps>) {
  return (
    <section
      className={`rounded-3xl p-6 ${className}`}
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(12px) saturate(110%)",
        WebkitBackdropFilter: "blur(12px) saturate(110%)",
        border: "1px solid rgba(167,139,250,0.14)",
        boxShadow: "0 18px 50px rgba(13,15,26,0.5)",
        ...style
      }}
    >
      {children}
    </section>
  )
}
