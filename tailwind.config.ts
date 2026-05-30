import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        moss: {
          50: "#f1f3ed",
          100: "#dde4d3",
          400: "#828f6b",
          700: "#445038",
          900: "#252d20"
        },
        parchment: "#f7f0e4",
        champagne: "#d4bea4"
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "Arial", "sans-serif"]
      },
      boxShadow: {
        envelope: "0 24px 60px rgba(22, 25, 18, 0.32)"
      }
    }
  },
  plugins: [],
};

export default config;
