/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kristin: {
          maroon: "#800020",
          cream: "#FFFDD0",
        },
        taylor: {
          orange: "#FF8C00",
        },
        nova: {
          indigo: "#4b0082",
          cyan: "#00ffff",
        },
        jace: {
          steel: "#555555",
          moss: "#aac0af",
        },
        rowan: {
          forest: "#228B22",
          lime: "#32CD32",
        },
        orion: {
          royal: "#4169E1",
          purple: "#9370DB",
        },
      },
    },
  },
  plugins: [],
}
