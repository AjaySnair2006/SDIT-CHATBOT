import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: "#F5F6F2",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#16213A",
          soft: "#4B5565",
          faint: "#8A93A3",
        },
        gold: {
          DEFAULT: "#B8862B",
          deep: "#8C6420",
          soft: "#EFE1C3",
        },
        campus: {
          green: "#1F5C4A",
          greensoft: "#DCEAE3",
        },
        border: "#E3E1D9",
        danger: "#B3432B",
        dark: {
          bg: "#0F1420",
          surface: "#171E2E",
          border: "#2A3346",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 80%, 100%": { opacity: "0.2" },
          "40%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.25s ease-out",
        blink: "blink 1.4s infinite both",
        slideIn: "slideIn 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
