/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nato': {
          light: '#93c5fd',
          DEFAULT: '#3b82f6',
          dark: '#1d4ed8',
        },
        'russia': {
          light: '#fca5a5',
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
        },
        'neutral': {
          light: '#d1d5db',
          DEFAULT: '#6b7280',
          dark: '#374151',
        }
      }
    },
  },
  plugins: [],
}
