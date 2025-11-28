/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0EA5E9", // Sky 500
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F0F9FF", // Sky 50
          foreground: "#0F172A",
        },
        accent: {
          DEFAULT: "#10B981", // Emerald 500
          foreground: "#FFFFFF",
        },
        background: "#FFFFFF",
        foreground: "#0F172A",
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#64748B",
        },
        border: "#E2E8F0",
      },
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
