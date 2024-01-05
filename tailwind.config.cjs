module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Inter: ["Inter"],
      },
      backgroundColor: {
        primary: "#121212",
        gray: {
          lighter: "#202020",
        },
      },

      colors: {
        primary: "#AAAAAE",
        gray: {
          light: "#CCC",
        },
      },
    },
  },
  plugins: [],
};
