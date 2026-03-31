import type { PropsWithChildren } from "react"

interface BadgeProps {
  tone?: "blue" | "green" | "red" | "amber" | "purple"
}

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, React.CSSProperties> = {
  blue:   { background: "#dceee8", color: "#2e6f64", border: "1px solid rgba(46,111,100,0.16)" },
  green:  { background: "#e8f5ea", color: "#4d8b67", border: "1px solid rgba(77,139,103,0.18)" },
  red:    { background: "#fdebea", color: "#bf5a53", border: "1px solid rgba(191,90,83,0.18)" },
  amber:  { background: "#fff1df", color: "#c98a42", border: "1px solid rgba(201,138,66,0.18)" },
  purple: { background: "#efe8fb", color: "#7152a3", border: "1px solid rgba(113,82,163,0.18)" }
}

export function Badge({ children, tone = "blue" }: PropsWithChildren<BadgeProps>) {
  return (
    <span
      className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
      style={toneStyles[tone]}
    >
      {children}
    </span>
  )
}
