/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enables manual class-based dark mode toggle
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        samrock: {
          dark: "#2e2e2e",
          card: "#383838",
          cyan: "#ff8c00",
          amber: "#ff8c00",
          silver: "#e5e7eb",
        },
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      }
    },
  },
  plugins: [],
};