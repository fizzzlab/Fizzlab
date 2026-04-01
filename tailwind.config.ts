import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          tan:     "#C89664",
          orange:  "#EB721B",
          navy:    "#010E22",
          "dark-blue": "#021C3B",
          "mid-blue":  "#03294E",
          "steel":     "#233E5C",
          "light-blue": "#256B97",
        },
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "Space Grotesk", "system-ui", "sans-serif"],
        mono:    ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-radial":   "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-gradient":     "linear-gradient(135deg, #010E22 0%, #021C3B 40%, #03294E 70%, #010E22 100%)",
        "card-gradient":     "linear-gradient(135deg, rgba(35,62,92,0.4) 0%, rgba(3,41,78,0.2) 100%)",
        "orange-gradient":   "linear-gradient(135deg, #EB721B 0%, #C89664 100%)",
        "blue-gradient":     "linear-gradient(135deg, #256B97 0%, #03294E 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass:        "0 4px 32px rgba(1, 14, 34, 0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        "glass-hover":"0 8px 48px rgba(1, 14, 34, 0.8), inset 0 1px 0 rgba(255,255,255,0.1)",
        "orange-glow":"0 0 32px rgba(235, 114, 27, 0.25)",
        "blue-glow":  "0 0 32px rgba(37, 107, 151, 0.25)",
        "card":       "0 2px 16px rgba(1, 14, 34, 0.5)",
      },
      animation: {
        "fade-in":      "fadeIn 0.5s ease-out",
        "slide-up":     "slideUp 0.5s ease-out",
        "slide-in-right":"slideInRight 0.4s ease-out",
        "pulse-slow":   "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow":    "spin 8s linear infinite",
        "shimmer":      "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%":   { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
