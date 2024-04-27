/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/pages/**/*.{html,js}",
    "./src/js/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily:{
        sans: ['Poppins'],
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui:{
    base: false,
    darkTheme: "light"
  },
}

