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
        obsidian: {
          DEFAULT: "#0e0a07",
          raised: "#13100c",
          overlay: "rgba(18,14,10,0.85)",
        },
        surface: {
          DEFAULT: "rgba(26,19,14,0.6)",
          hover: "rgba(32,24,18,0.85)",
        },
        bone: {
          DEFAULT: "#ece3d3",
          muted: "rgba(236,227,211,0.72)",
        },
        muted: {
          DEFAULT: "#9a9184",
          2: "rgba(154,145,132,0.85)",
        },
        ember: {
          DEFAULT: "#e0723a",
          soft: "#c85e2a",
          glow: "#f3a861",
          dim: "rgba(224,114,58,0.18)",
          border: "rgba(224,114,58,0.28)",
          "border-strong": "rgba(224,114,58,0.5)",
        },
        border: {
          DEFAULT: "rgba(120,95,70,0.28)",
          mid: "rgba(120,95,70,0.45)",
          strong: "rgba(120,95,70,0.65)",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', '"Cormorant Garamond"', "ui-serif", "Georgia", "serif"],
        sans: ['"Plus Jakarta Sans"', '"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', "ui-monospace", "Menlo", "monospace"],
      },
      fontSize: {
        micro: ["8px", { letterSpacing: "0.32em", lineHeight: "1.5" }],
        label: ["9px", { letterSpacing: "0.3em", lineHeight: "1.5" }],
        "label-lg": ["10.5px", { letterSpacing: "0.28em", lineHeight: "1.5" }],
      },
      boxShadow: {
        ember: "0 0 48px -6px rgba(224,114,58,0.55), 0 0 120px -24px rgba(243,168,97,0.35)",
        card: "0 4px 32px rgba(0,0,0,0.5)",
      },
      animation: {
        "pulse-dot": "pulse-dot 1.8s ease-in-out infinite",
        "orb-pulse": "orb-pulse 4s ease-in-out infinite",
        "rise": "rise 1s ease both",
        "rise-slow": "rise-slow 1s ease both",
        "tick-in": "tick-in 0.1s ease both",
        "wave": "wave 1s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "count-flicker": "count-flicker 0.15s ease both",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.35", transform: "scale(0.8)" },
        },
        "orb-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 60px 8px rgba(224,114,58,0.25), 0 0 120px 20px rgba(224,114,58,0.1)",
          },
          "50%": {
            boxShadow: "0 0 80px 12px rgba(224,114,58,0.38), 0 0 160px 28px rgba(224,114,58,0.16)",
          },
        },
        rise: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "rise-slow": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "tick-in": {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        wave: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "count-flicker": {
          from: { opacity: "0.4" },
          to: { opacity: "1" },
        },
      },
      backgroundImage: {
        noise: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.65 0 0 0 0 0.45 0 0 0 0 0.25 0 0 0 0.4 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>\")",
      },
    },
  },
  plugins: [],
};

export default config;
