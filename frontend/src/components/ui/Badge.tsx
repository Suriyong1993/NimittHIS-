import type { PropsWithChildren } from "react"

interface BadgeProps {
  tone?: "blue" | "green" | "red" | "amber" | "purple"
}

/* MindCare dark-tone badge colours */
const toneStyles: Record<NonNullable<BadgeProps["tone"]>, React.CSSProperties> = {
  blue:   { background: "rgba(167,139,250,0.14)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.28)" },
  green:  { background: "rgba(16,185,129,0.12)",  color: "#10b981", border: "1px solid rgba(16,185,129,0.26)" },
  red:    { background: "rgba(244,63,94,0.12)",   color: "#f43f5e", border: "1px solid rgba(244,63,94,0.28)" },
  amber:  { background: "rgba(251,146,60,0.12)",  color: "#fb923c", border: "1px solid rgba(251,146,60,0.28)" },
  purple: { background: "rgba(124,58,237,0.14)",  color: "#a78bfa", border: "1px solid rgba(124,58,237,0.28)" }
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
