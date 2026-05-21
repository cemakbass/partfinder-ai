import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        pf: {
          background: "#131315",
          surface: "#131315",
          "surface-container": "#201f22",
          "surface-container-high": "#2a2a2c",
          "surface-container-low": "#1c1b1d",
          "surface-container-lowest": "#0e0e10",
          primary: "#ffe1a7",
          "primary-container": "#fbbf24",
          "on-primary-container": "#261a00",
          "on-surface": "#e5e1e4",
          "on-surface-variant": "#d3c5ac",
          "outline-variant": "#4f4633"
        }
      },
      fontFamily: {
        dashboard: ["var(--font-dashboard)", "Inter", "system-ui", "sans-serif"],
        "dashboard-mono": ["var(--font-dashboard-mono)", "JetBrains Mono", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
