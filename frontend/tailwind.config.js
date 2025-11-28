/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF9D6F',
          dark: '#FF7B47',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1F2937'
        }
      },
    },
  },
  plugins: [],
}
