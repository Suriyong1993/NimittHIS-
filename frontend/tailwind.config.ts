import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "nimitt-bg": "#F7F7F5",
        "nimitt-surface": "#FFFFFF",
        "nimitt-border": "#E5E5E0",
        "nimitt-ink": "#111110",
        "nimitt-muted": "#6B6B65",
        "nimitt-faint": "#A0A09A",
        "nimitt-blue": "#2563EB",
        "nimitt-blue-bg": "#EFF6FF",
        "nimitt-blue-dark": "#1D4ED8",
        "nimitt-green": "#16A34A",
        "nimitt-green-bg": "#F0FDF4",
        "nimitt-red": "#DC2626",
        "nimitt-red-bg": "#FEF2F2",
        "nimitt-amber": "#D97706",
        "nimitt-amber-bg": "#FFFBEB",
        "nimitt-purple": "#7C3AED",
        "nimitt-purple-bg": "#F5F3FF",
        "nimitt-teal": "#0891B2",
        "nimitt-teal-bg": "#ECFEFF"
      },
      fontFamily: {
        thai: ["var(--font-thai)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      boxShadow: {
        panel: "0 18px 50px rgba(17,17,16,0.08)",
        "panel-md": "0 24px 64px rgba(17,17,16,0.12)",
        "inner-sm": "inset 0 1px 2px rgba(17,17,16,0.06)"
      },
      animation: {
        "fade-in": "fade-in 0.35s ease both",
        "slide-up": "slide-up 0.4s ease both",
        "slide-in-left": "slide-in-left 0.35s ease both",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "spin-slow": "spin-slow 1.2s linear infinite",
        shimmer: "shimmer 1.6s infinite linear"
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" }
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to: { opacity: "1", transform: "translateX(0)" }
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" }
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" }
        }
      }
    }
  },
  plugins: []
} satisfies Config
