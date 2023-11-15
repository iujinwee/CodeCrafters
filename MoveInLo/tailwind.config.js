/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      textColor: {
        primary: "#181C62",
        secondary: "#D71440",
        black: "#000000",
        white: "#FFFFFF",
        error: "#ED2020",
        gray: "#635C5C",
      },
      backgroundColor: {
        primary: "#181C62",
        white: "#FFFFFF",
      },
      colors: {
        primary: "#181C62",
        secondary: "#D71440",
        black: "#000000",
        white: "#FFFFFF",
        error: "#ED2020",
      },
      borderColor: {
        primary: "#181C62",
        secondary: "#D71440",
        black: "#000000",
        white: "#FFFFFF",
        error: "#ED2020",
        gray: "#887E7E",
      },
      fontFamily: {
        RobotoBold: "RobotoBold",
        RobotoBlack: "RobotoBlack",
        RobotoLight: "RobotoLight",
        RobotoMedium: "RobotoMedium",
        RobotoRegular: "RobotoRegular",
      },
    },
  },
  plugins: [],
};
