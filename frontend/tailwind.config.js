/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2E7D32',
        secondary: '#4CAF50',
        accent: '#FFC107',
        danger: '#F44336',
        warning: '#FF9800',
        info: '#2196F3',
        success: '#4CAF50',
        lightBg: '#F8F9FA',
        darkText: '#212121',
        lightText: '#757575',
        borderColor: '#E0E0E0',
      },
      fontFamily: {
        'bengali': ['Noto Sans Bengali', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}