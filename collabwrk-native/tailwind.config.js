/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0f172a",
          foreground: "#f8fafc",
        },
        secondary: {
          DEFAULT: "#f97316",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#e2e8f0",
          foreground: "#64748b",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0f172a",
        },
        background: "#f8fafc",
        foreground: "#0f172a",
        border: "#e2e8f0",
      },
    },
  },
  plugins: [],
}

