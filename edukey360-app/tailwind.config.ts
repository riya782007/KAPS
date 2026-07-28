import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#3B4EFF", dark: "#3042F2", light: "#EEF1FF" },
        cyan: "#18C8FF",
        teal: "#18D8A5",
        success: "#16C47F",
        warning: "#F7B731",
        error: "#F04438",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["General Sans", "Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 4px 22px rgba(15,38,32,.08)",
        lg2: "0 18px 50px rgba(15,38,32,.18)",
      },
      keyframes: {
        pop: { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "none" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        pulse2: { "70%": { boxShadow: "0 0 0 10px rgba(18,165,140,0)" }, "100%": { boxShadow: "0 0 0 0 rgba(18,165,140,0)" } },
      },
      animation: {
        pop: "pop .4s cubic-bezier(.22,.9,.3,1) both",
        pulse2: "pulse2 1.6s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
