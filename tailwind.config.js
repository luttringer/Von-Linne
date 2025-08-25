module.exports = {
  mode: "jit",
  content: [
    "./*.html",
    "./src/**/*.js"
  ],
  theme: {
    extend: {
      colors:
      {
        gray_one: "#a9a9a9",
        yellow_one: "#ffe4c4",
        gray_two: "#303030",
        gray_three: "#545454",
        gray_four: "#2f2f2f",
        green_one: "#00A550",
        lavanda_one: "#F0F8FF",
        blue_one: "#102032"
      },
      fontFamily: {
        josefin: ["Josefin Sans", "sans-serif;"]
      }
    },
  },
  darkMode: "class",
  plugins: [],
};