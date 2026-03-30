import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ─── MindCare Dark Palette (remapped to nimitt-* for BC) ───────────────
        // Background layers
        "nimitt-bg":      "#0d0f1a",
        "nimitt-surface": "rgba(255,255,255,0.05)",
        "nimitt-border":  "rgba(167,139,250,0.18)",

        // Text
        "nimitt-ink":   "#f1f5f9",
        "nimitt-muted": "#94a3b8",
        "nimitt-faint": "#64748b",

        // Primary — lavender/violet
        "nimitt-blue":      "#a78bfa",
        "nimitt-blue-bg":   "rgba(167,139,250,0.12)",
        "nimitt-blue-dark": "#7c3aed",

        // Secondary — calm teal
        "nimitt-teal":    "#2dd4bf",
        "nimitt-teal-bg": "rgba(45,212,191,0.10)",

        // Semantic
        "nimitt-green":    "#10b981",
        "nimitt-green-bg": "rgba(16,185,129,0.12)",
        "nimitt-red":      "#f43f5e",
        "nimitt-red-bg":   "rgba(244,63,94,0.12)",
        "nimitt-amber":    "#fb923c",
        "nimitt-amber-bg": "rgba(251,146,60,0.12)",
        "nimitt-purple":   "#7c3aed",
        "nimitt-purple-bg":"rgba(124,58,237,0.12)",

        // ─── MindCare aliases (new) ────────────────────────────────────────────
        "mc-bg":       "#0d0f1a",
        "mc-surface":  "#111827",
        "mc-glass":    "rgba(255,255,255,0.05)",
        "mc-lavender": "#a78bfa",
        "mc-violet":   "#7c3aed",
        "mc-teal":     "#2dd4bf",
        "mc-peach":    "#fb923c",
        "mc-rose":     "#f43f5e",
        "mc-mint":     "#10b981",
        "mc-border":   "rgba(167,139,250,0.18)",

        // ─── Mood colours ──────────────────────────────────────────────────────
        "mood-great":    "#fbbf24",
        "mood-good":     "#34d399",
        "mood-neutral":  "#60a5fa",
        "mood-bad":      "#f97316",
        "mood-terrible": "#f43f5e"
      },
      fontFamily: {
        thai:    ["var(--font-thai)",    "Sarabun",       "sans-serif"],
        mono:    ["var(--font-mono)",    "JetBrains Mono","monospace"],
        display: ["var(--font-display)", "Rajdhani",      "sans-serif"]
      },
      boxShadow: {
        // Legacy
        panel:        "0 18px 50px rgba(13,15,26,0.6)",
        "panel-md":   "0 24px 64px rgba(13,15,26,0.75)",
        "inner-sm":   "inset 0 1px 2px rgba(255,255,255,0.04)",
        // Glow
        "glow-lavender": "0 0 32px rgba(167,139,250,0.25)",
        "glow-teal":     "0 0 32px rgba(45,212,191,0.20)",
        "glow-violet":   "0 0 48px rgba(124,58,237,0.30)"
      },
      backgroundImage: {
        "mesh-dark":    "radial-gradient(ellipse at 20% 20%, rgba(124,58,237,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(45,212,191,0.12) 0%, transparent 55%)",
        "lavender-grad":"linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
        "teal-grad":    "linear-gradient(135deg, #2dd4bf 0%, #0891b2 100%)",
        "shimmer-dark": "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)"
      },
      animation: {
        "fade-in":       "fade-in 0.35s ease both",
        "slide-up":      "slide-up 0.4s ease both",
        "slide-in-left": "slide-in-left 0.35s ease both",
        "pulse-soft":    "pulse-soft 2s ease-in-out infinite",
        "spin-slow":     "spin-slow 1.2s linear infinite",
        shimmer:         "shimmer 1.6s infinite linear",
        "glow-pulse":    "glow-pulse 3s ease-in-out infinite"
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" }
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to:   { opacity: "1", transform: "translateY(0)" }
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to:   { opacity: "1", transform: "translateX(0)" }
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.45" }
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" }
        },
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" }
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(167,139,250,0.15)" },
          "50%":      { boxShadow: "0 0 40px rgba(167,139,250,0.35)" }
        }
      }
    }
  },
  plugins: []
} satisfies Config

