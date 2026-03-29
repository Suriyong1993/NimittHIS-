import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
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
        thai: ["Sarabun", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"]
      },
      boxShadow: {
        panel: "0 18px 50px rgba(17,17,16,0.08)"
      }
    }
  },
  plugins: []
} satisfies Config
