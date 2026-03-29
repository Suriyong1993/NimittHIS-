import type { PropsWithChildren } from "react"

interface CardProps {
  className?: string
}

export function Card({ children, className = "" }: PropsWithChildren<CardProps>) {
  return (
    <section className={`rounded-3xl border border-nimitt-border bg-nimitt-surface p-6 shadow-panel ${className}`}>
      {children}
    </section>
  )
}
