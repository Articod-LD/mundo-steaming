import type { Config } from "tailwindcss";
const colors = require('tailwindcss/colors');

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
        "3xl": "1780px",
        "4xl": "2160px",
      },
      colors: {
        brand: {
          DEFAULT: "#D72229",
          dark:'#8d1003'
        },
        light: {
          DEFAULT: "#ffffff",
          base: "#646464",
          100: "#f9f9f9",
          200: "#f2f2f2",
          300: "#ededed",
          400: "#e6e6e6",
          500: "#dadada",
          600: "#d2d2d2",
          800: "#bcbcbc",
          900: "#a8a8a8",
        },
        dark: {
          DEFAULT: "#000000",
          base: "#a5a5a5",
          100: "#181818",
          200: "#212121",
          250: "#252525",
          300: "#2a2a2a",
          350: "#2b2b2b",
          400: "#323232",
          450: "#2e2e2e",
          500: "#3e3e3e",
          600: "#4a4a4a",
          700: "#6e6e6e",
          800: "#808080",
          850: "#989898",
          900: "#999999",
          950: "#2b2b2b",
        },
        warning: "#e66767",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      boxShadow: {
        card: "0px 0px 6px rgba(79, 95, 120, 0.1)",
        dropdown: "0px 10px 32px rgba(46, 57, 72, 0.2)",
        "bottom-nav": "0 -2px 3px rgba(0, 0, 0, 0.08)",
      },
      fontSize: {
        "10px": ".625rem",
        "13px": "13px",
        "15px": "15px",
      },

      fontFamily: {
        body: ["'Inter', sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms"),require('@tailwindcss/line-clamp')],
};
export default config;
