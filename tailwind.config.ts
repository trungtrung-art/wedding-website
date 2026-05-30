import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream:    { 50: "#f8f3eb", 100: "#e8d9c2" },
        bronze:   { 500: "#b58552" },
        burgundy: { 600: "#7a2d2d", 900: "#2d2218" },
      },
      fontFamily: {
        serif:  ["var(--font-playfair)", "Georgia", "serif"],
        script: ["var(--font-cormorant)", "Georgia", "serif"],
        sans:   ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
