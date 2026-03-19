/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        organo: {
          green: "#25634D",
          gray: "#5C5C5C",
          pistachio: "#B8D94F",
          gold: "#FED34A",
          cream: "#F9F9F5",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ['"Playfair Display"', "serif"],
      },
    },
  },
  plugins: [],
};
