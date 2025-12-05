/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 热敏打印机字体（小票字体）- 使用 Fusion Pixel 12px
        'receipt': ['"Fusion Pixel 12px Proportional SC"', 'monospace'],
        'receipt-alt': ['"Fusion Pixel 12px Proportional SC"', 'monospace'],
        // 保留原有的 mono 字体作为备用
        'mono': ['"Fusion Pixel 12px Proportional SC"', 'monospace'],
      },
      letterSpacing: {
        'receipt': '0.05em', // 小票特有的字符间距
      },
    },
  },
  plugins: [],
}
