import type { ButtonHTMLAttributes, PropsWithChildren } from "react"

type Variant = "primary" | "secondary" | "ghost" | "danger"
type Size = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-nimitt-blue text-white hover:bg-nimitt-blue-dark active:scale-[0.98] shadow-sm",
  secondary: "bg-nimitt-surface text-nimitt-ink border border-nimitt-border hover:bg-stone-50 active:scale-[0.98]",
  ghost: "bg-transparent text-nimitt-muted hover:bg-black/5 active:scale-[0.98]",
  danger: "bg-nimitt-red text-white hover:bg-red-700 active:scale-[0.98] shadow-sm"
}

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-5 py-3 text-base gap-2.5"
}

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      disabled={disabled ?? loading}
      className={[
        "inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nimitt-blue focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className
      ].join(" ")}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin-slow h-3.5 w-3.5 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      )}
      {children}
    </button>
  )
}
