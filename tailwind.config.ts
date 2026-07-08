import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        lab: {
          void: "#050816",
          panel: "#0a1024",
          panel2: "#101735",
          line: "#22d3ee",
          glow: "#38bdf8",
          violet: "#7c3aed",
          emerald: "#34d399",
          amber: "#fbbf24",
          danger: "#fb7185"
        }
      },
      boxShadow: {
        glow: "0 0 28px rgba(34, 211, 238, 0.28)",
        "glow-strong": "0 0 42px rgba(56, 189, 248, 0.42)"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
