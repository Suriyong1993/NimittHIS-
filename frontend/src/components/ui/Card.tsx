import type { CSSProperties, PropsWithChildren } from "react"

interface CardProps {
  className?: string
  style?: CSSProperties
}

export function Card({ children, className = "", style }: PropsWithChildren<CardProps>) {
  return (
    <section
      className={`rounded-3xl border border-nimitt-border bg-nimitt-surface p-6 shadow-panel ${className}`}
      style={style}
    >
      {children}
    </section>
  )
}
