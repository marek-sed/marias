/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "game-color": "var(--game-color)",
        "game-border-color": "var(--game-border-color)",
        "game-accent-color": "var(--game-accent-color)",
        "accent-color": "var(--teal9)",
        "accent-active-color": "var(--teal10)",
      },
    },
  },
  plugins: [require("windy-radix-palette"), require("@tailwindcss/forms")],
};
