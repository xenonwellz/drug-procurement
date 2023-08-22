const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Saira Condensed',
          ...defaultTheme.fontFamily.sans,
        ]
      }
    },
    container: {
      center: true,
      padding: "2rem"
    }
  },
  plugins: [],
}