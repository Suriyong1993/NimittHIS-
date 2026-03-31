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
        background: "rgba(255,255,255,0.86)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(23,48,41,0.08)",
        boxShadow: "0 16px 36px rgba(24,58,54,0.08)",
        ...style
      }}
    >
      {children}
    </section>
  )
}
