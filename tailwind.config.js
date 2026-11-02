/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enables manual class-based dark mode toggle

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // Brand colours (brand / surface / hairline / strong / silver) and the
  // `text-gradient` utility live in globals.css so they can flip per theme.
  theme: {
    extend: {
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
      },
    },
  },

  plugins: [],
};
