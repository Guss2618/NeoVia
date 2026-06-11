module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0f3f74",
          dark: "#0a2b52",
          surface: "rgba(255, 255, 255, 0.08)",
          muted: "rgba(255, 255, 255, 0.78)",
        },
      },
      boxShadow: {
        card: "0 24px 70px rgba(0, 0, 0, 0.24)",
      },
      borderRadius: {
        brand: "28px",
      },
    },
  },
  plugins: [],
};
