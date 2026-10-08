import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // obsidian/surface/ember DEFAULTs route through the `<alpha-value>`
        // pattern (backed by *-rgb CSS variables in globals.css) so Tailwind
        // opacity modifiers (bg-obsidian/80, etc.) keep working once the
        // underlying value is swapped per light/dark theme.
        obsidian: {
          DEFAULT: "rgb(var(--bg-rgb) / <alpha-value>)",
          raised: "rgb(var(--bg-raised-rgb) / <alpha-value>)",
          overlay: "var(--bg-overlay)",
        },
        surface: {
          DEFAULT: "rgb(var(--surface-rgb) / <alpha-value>)",
          hover: "var(--surface-hover)",
        },
        bone: {
          DEFAULT: "var(--bone)",
          muted: "var(--bone-muted)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          2: "var(--muted-2)",
        },
        ember: {
          DEFAULT: "rgb(var(--ember-rgb) / <alpha-value>)",
          soft: "var(--ember-soft)",
          glow: "var(--ember-glow)",
          dim: "var(--ember-dim)",
          border: "var(--ember-border)",
          "border-strong": "var(--ember-border-strong)",
        },
        border: {
          DEFAULT: "var(--border-color)",
          mid: "var(--border-mid)",
          strong: "var(--border-strong)",
        },
        crit: "rgb(var(--crit-rgb) / <alpha-value>)",
        ok: "rgb(var(--ok-rgb) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", '"Cormorant Garamond"', "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", '"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "ui-serif", "Georgia", "serif"],
        mono: ["var(--font-plex)", '"JetBrains Mono"', "ui-monospace", "Menlo", "monospace"],
      },
      fontSize: {
        micro: ["10px", { letterSpacing: "0.2em", lineHeight: "1.5" }],
        label: ["11px", { letterSpacing: "0.2em", lineHeight: "1.5" }],
        "label-lg": ["12px", { letterSpacing: "0.2em", lineHeight: "1.5" }],
      },
      boxShadow: {
        ember: "0 10px 40px -10px rgba(var(--ember-rgb), 0.55)",
        card: "0 24px 60px -20px rgba(0,0,0,0.6)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 0.8, 0.2, 1)",
      },
      animation: {
        "pulse-dot": "pulse-dot 1.8s ease-in-out infinite",
        "wave": "wave 1s ease-in-out infinite",
        "blink": "blink 1.1s steps(2) infinite",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.35", transform: "scale(0.8)" },
        },
        wave: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
        blink: {
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
