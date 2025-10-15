/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B0000',
          dark: '#700000',
          darker: '#5b0000',
        },
      },
    },
  },
  plugins: [],
}


