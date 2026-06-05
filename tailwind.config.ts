import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream:    { 50: "#efe3dd", 100: "#e6d1ca" },
        bronze:   { 500: "#c49a5a" },
        burgundy: { 600: "#6f101b", 900: "#251312" },
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
