import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1f2940",
        muted: "#8f95a3",
        border: "#e6e7ef",
        surface: "#f6f7fb",
        brand: "#4f46e5",
        accent: "#2ea8ff",
        night: "#171d2f",
      },
      boxShadow: {
        card: "0 20px 45px rgba(31, 41, 64, 0.08)",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(150deg, transparent 0 62%, rgba(79,70,229,0.1) 62% 63%, transparent 63%), linear-gradient(150deg, transparent 0 48%, rgba(79,70,229,0.08) 48% 49%, transparent 49%), linear-gradient(150deg, transparent 0 34%, rgba(79,70,229,0.08) 34% 35%, transparent 35%)",
      },
    },
  },
  plugins: [],
};

export default config;
