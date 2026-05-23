/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        red: {
          primary: '#d32f2f',
          dark: '#b71c1c',
          light: '#fff5f5',
        },
        gray: {
          light: '#f5f5f5',
          border: '#e0e0e0',
          icon: '#999',
          text: '#333',
        },
        pink: {
          gradient1: '#fce4ec',
          gradient2: '#f8bbd0',
        },
      },
    },
  },
  plugins: [],
}

