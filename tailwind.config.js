/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Receipt pixel font (used only for receipt output)
        'receipt': ['"Fusion Pixel 12px Monospaced SC"', '"Zpix"', 'monospace'],
        'receipt-alt': ['"Fusion Pixel 12px Monospaced SC"', '"Zpix"', 'monospace'],
      },
      letterSpacing: {
        'receipt': '0.05em', // Receipt-specific character spacing
      },
    },
  },
  plugins: [],
}
