/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#2B1E23",
          soft: "#6B4E57",
          accent: "#EC4899",
        },
      },
    },
  },
  plugins: [],
};
