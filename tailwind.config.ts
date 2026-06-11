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
        background: "#f3f4f6",
        surface: "#ffffff",
        text: "#111827",
        muted: "#6b7280",
        border: "#d1d5db",
        accent: "#1f2937",
      },
      boxShadow: {
        panel: "0 12px 30px -18px rgba(17, 24, 39, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
