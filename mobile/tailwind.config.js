/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      letterSpacing: {
        tightest: -1,
        tighter: -0.5,
        tight: -0.25,
        normal: 0,
        wide: 0.25,
        wider: 0.5,
        widest: 1,
        'widest-xl': 2,
        'widest-2xl': 2.5,
        'widest-3xl': 3,
      },
    },
  },
  plugins: [],
}

