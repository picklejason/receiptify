/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "receipt-paper": "url('/receipt-paper.png')",
      },
      fontFamily: {
        sans: ["Merchant Copy", "sans-serif"],
      },
    },
  },
  plugins: [],
};
