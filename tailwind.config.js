export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cube-white': '#ffffff',
        'cube-yellow': '#fcd34d',
        'cube-red': '#ef4444',
        'cube-orange': '#f97316',
        'cube-green': '#10b981',
        'cube-blue': '#3b82f6',
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-cube-white',
    'bg-cube-yellow',
    'bg-cube-red',
    'bg-cube-orange',
    'bg-cube-green',
    'bg-cube-blue',
  ]
}