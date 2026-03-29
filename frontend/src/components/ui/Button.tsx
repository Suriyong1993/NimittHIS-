import type { ButtonHTMLAttributes, PropsWithChildren } from "react"

type Variant = "primary" | "secondary" | "ghost"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-nimitt-blue text-white hover:bg-blue-700",
  secondary: "bg-nimitt-surface text-nimitt-ink border border-nimitt-border hover:bg-stone-50",
  ghost: "bg-transparent text-nimitt-muted hover:bg-black/5"
}

export function Button({
  children,
  className = "",
  variant = "primary",
  fullWidth = false,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${variantClasses[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
