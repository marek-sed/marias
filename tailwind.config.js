/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "game-color": "var(--game-color)",
        "game-color-hover": "var(--game-color-hover)",
        "game-color-active": "var(--game-color-active)",
        "game-bg-color": "var(--game-bg-color)",
        "game-bg-hover-color": "var(--game-bg-hover-color)",
        "game-bg-active-color": "var(--game-bg-active-color)",
        "game-border-color": "var(--game-border-color)",
        "game-border-hover-color": "var(--game-border-hover-color)",
        "accent-color": "var(--teal9)",
        "accent-active-color": "var(--teal10)",
      },
    },
  },
  plugins: [require("windy-radix-palette"), require("@tailwindcss/forms")],
};
