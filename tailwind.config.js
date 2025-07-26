/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'petit-primary': '#f17258',
        'petit-primary-light': '#f6a28d',
        'petit-primary-dark': '#d55640',
        'petit-secondary': '#0ea5e9',
        'petit-secondary-light': '#38bdf8',
        'petit-secondary-dark': '#0284c7',
        'petit-accent': '#eab308',
        'petit-accent-light': '#facc15',
        'petit-accent-dark': '#ca8a04',
        'petit-success': '#22c55e',
        'petit-warning': '#f59e0b',
        'petit-error': '#ef4444',
      },
      fontFamily: {
        'nanum': ['NanumSquareRound', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} 