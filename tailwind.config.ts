// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    // other paths if needed...
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Source Serif 4'", "serif"],
      },
    },
  },
  plugins: [],
};