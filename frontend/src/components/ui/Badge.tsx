import type { PropsWithChildren } from "react"

interface BadgeProps {
  tone?: "blue" | "green" | "red" | "amber" | "purple"
}

const toneClasses = {
  blue: "bg-nimitt-blue-bg text-nimitt-blue",
  green: "bg-nimitt-green-bg text-nimitt-green",
  red: "bg-nimitt-red-bg text-nimitt-red",
  amber: "bg-nimitt-amber-bg text-nimitt-amber",
  purple: "bg-nimitt-purple-bg text-nimitt-purple"
}

export function Badge({ children, tone = "blue" }: PropsWithChildren<BadgeProps>) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}>
      {children}
    </span>
  )
}
