/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'zillow-blue': '#1277e1',
        'zillow-dark-blue': '#0b5bb5',
        'zillow-light-blue': '#e6f2ff',
        'zillow-gray': '#f5f5f5',
        'zillow-dark-gray': '#2a2a33',
        'zillow-text': '#2a2a33',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}