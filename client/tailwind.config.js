/** @type {import('tailwindcss').Config} */ import withMT from "@material-tailwind/react/utils/withMT";

const tailwindConfig = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      ...require("tailwindcss/colors"),
      "blue-100": "#1e1d85",
      "gray-900": "rgba(0,0,0,0.35)",
      "gray-999": "rgba(0,0,0,0.75)",
      "indigo-750": "#6d6cb0",
      "white-100": "rgba(255, 255, 255, 0.4)",
      "white-50": "rgba(255, 255, 255, 0.85)",
      ownFormbg: "#EBEBEB",
      prptyIcons: "#0EC6D5",
    },
    backgroundImage: {
      bannerImg:
        "url('https://res.cloudinary.com/dn6anfym7/image/upload/v1698482035/dreamHome/h4vnyiujlnurhzhjn98u.jpg')",
      loginBg:
        "url(https://res.cloudinary.com/dn6anfym7/image/upload/v1699693210/ezgif.com-resize_osqicn.gif)",
      adminLogBg:
        "url(https://www.pixground.com/wp-content/uploads/2023/10/Floating-City-Pixel-World-AI-Generated-4K-Wallpaper-1536x864.webp)",
    },
    extend: {
      spacing: {
        128: "85vh",
        120: "65vw",
        100: "25rem",
        104: "26rem",
        108: "27rem",
        112: "28rem",
        116: "29rem",
        121: "30rem",
        124: "31rem",
        130: "32rem",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        promt: ["Prompt", "sans-serif"],
        ubuntu: ["Ubuntu", "sans-serif"],
      },
      transitionProperty: {
        margin: "margin",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};

export default withMT(tailwindConfig);
