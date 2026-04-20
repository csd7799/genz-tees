import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          black: "#0A0A0F",
          deep: "#0E0E15",
          surface: "#14141F",
          card: "#1A1A2A",
          border: "#2A2A3A",
        },
        nebula: {
          DEFAULT: "#7B2FBE",
          light: "#9B4FDE",
          dark: "#5B1F9E",
          glow: "rgba(123, 47, 190, 0.3)",
        },
        vyom: {
          cyan: "#00D4FF",
          "cyan-light": "#33DDFF",
          "cyan-glow": "rgba(0, 212, 255, 0.3)",
        },
        stardust: "#E8E8F0",
        muted: "#B0B0C0",
        "muted-dark": "#6A6A80",
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        grotesk: ["Space Grotesk", "sans-serif"],
        dm: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        label: "0.25em",
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "drift": "drift 20s linear infinite",
        "void-expand": "void-expand 1.5s ease-out forwards",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(123, 47, 190, 0.4), 0 0 40px rgba(123, 47, 190, 0.2)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(123, 47, 190, 0.6), 0 0 60px rgba(123, 47, 190, 0.3)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        drift: {
          "0%": { transform: "translateX(0) translateY(0)" },
          "25%": { transform: "translateX(10px) translateY(-5px)" },
          "50%": { transform: "translateX(-5px) translateY(-10px)" },
          "75%": { transform: "translateX(-10px) translateY(5px)" },
          "100%": { transform: "translateX(0) translateY(0)" },
        },
        "void-expand": {
          "0%": { transform: "scale(0)", opacity: "1" },
          "80%": { transform: "scale(50)", opacity: "1" },
          "100%": { transform: "scale(50)", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "nebula-gradient": "linear-gradient(135deg, #7B2FBE 0%, #00D4FF 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
