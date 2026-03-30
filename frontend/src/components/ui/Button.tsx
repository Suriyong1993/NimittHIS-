import type { ButtonHTMLAttributes, PropsWithChildren } from "react"

type Variant = "primary" | "secondary" | "ghost" | "danger"
type Size    = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant
  size?:     Size
  fullWidth?: boolean
  loading?:  boolean
}

/* MindCare dark-theme button variants */
const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
    color: "#fff",
    border: "1px solid transparent",
    boxShadow: "0 0 20px rgba(167,139,250,0.30)"
  },
  secondary: {
    background: "rgba(255,255,255,0.06)",
    color: "#f1f5f9",
    border: "1px solid rgba(167,139,250,0.22)"
  },
  ghost: {
    background: "transparent",
    color: "#94a3b8",
    border: "1px solid transparent"
  },
  danger: {
    background: "rgba(244,63,94,0.15)",
    color: "#f43f5e",
    border: "1px solid rgba(244,63,94,0.30)",
    boxShadow: "0 0 12px rgba(244,63,94,0.15)"
  }
}

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-5 py-3 text-base gap-2.5"
}

export function Button({
  children,
  className = "",
  variant   = "primary",
  size      = "md",
  fullWidth  = false,
  loading   = false,
  disabled,
  style,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      disabled={disabled ?? loading}
      className={[
        "inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-150 active:scale-[0.97] focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className
      ].join(" ")}
      style={{ ...variantStyles[variant], ...style }}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin-slow h-3.5 w-3.5 flex-shrink-0"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        >
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      )}
      {children}
    </button>
  )
}
