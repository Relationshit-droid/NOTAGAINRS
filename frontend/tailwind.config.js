/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'romance-pink': '#FA1F63',
        'royal-purple': '#5C1459',
        'trust-green': '#33DEA5',
        'chaos-yellow': '#E4E831',
        'healing-purple': '#BE1980',
        'dark-bg': '#0a0012',
        'dark-surface': '#1a0020',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
