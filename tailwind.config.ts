import type { Config } from "tailwindcss";

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1C1C28",
          50: "#f8f9fa",
          100: "#e9ecef",
          200: "#dee2e6",
          300: "#ced4da",
          400: "#adb5bd",
          500: "#1C1C28",
          600: "#18181f",
          700: "#141419",
          800: "#0f0f12",
          900: "#0a0a0c",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("daisyui"),
  ],
} satisfies Config;

export default config; 