/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { jettura: "#3b60ff" },
      borderRadius: { xl: "1.5rem", "2xl": "2rem", "3xl": "3rem" }
    },
  },
  plugins: [],
}