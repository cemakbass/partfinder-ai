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
        },
        background: "#131315",
        surface: "#131315",
        "surface-container": "#201f22",
        "surface-container-high": "#2a2a2c",
        "surface-container-low": "#1c1b1d",
        "surface-container-lowest": "#0e0e10",
        "surface-bright": "#39393b",
        "surface-variant": "#353437",
        "surface-dim": "#131315",
        primary: "#ffe1a7",
        "primary-container": "#fbbf24",
        "primary-fixed": "#ffdf9f",
        "primary-fixed-dim": "#f9bd22",
        "on-primary": "#402d00",
        "on-primary-container": "#6c4f00",
        "on-primary-fixed": "#261a00",
        "on-surface": "#e5e1e4",
        "on-surface-variant": "#d3c5ac",
        "on-background": "#e5e1e4",
        outline: "#9c8f79",
        "outline-variant": "#4f4633",
        "inverse-surface": "#e5e1e4",
        "inverse-on-surface": "#313032",
        "inverse-primary": "#795900",
        "surface-tint": "#f9bd22",
        secondary: "#c8c5ca",
        "secondary-container": "#47464a",
        "on-secondary": "#303033",
        "on-secondary-container": "#b6b4b8",
        tertiary: "#e6e3e7",
        "tertiary-container": "#c9c7cb",
        "on-tertiary": "#303033",
        "on-tertiary-container": "#545356",
        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6"
      },
      spacing: {
        "margin-mobile": "16px",
        "margin-desktop": "40px"
      },
      fontSize: {
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" }],
        button: ["14px", { lineHeight: "20px", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "700" }],
        display: ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "800" }]
      },
      fontFamily: {
        dashboard: ["var(--font-dashboard)", "Inter", "system-ui", "sans-serif"],
        "dashboard-mono": ["var(--font-dashboard-mono)", "JetBrains Mono", "monospace"],
        "label-sm": ["var(--font-dashboard-mono)", "JetBrains Mono", "monospace"],
        button: ["var(--font-dashboard)", "Inter", "sans-serif"],
        "body-md": ["var(--font-dashboard)", "Inter", "sans-serif"],
        "body-lg": ["var(--font-dashboard)", "Inter", "sans-serif"],
        "headline-md": ["var(--font-dashboard)", "Inter", "sans-serif"],
        "headline-lg": ["var(--font-dashboard)", "Inter", "sans-serif"],
        display: ["var(--font-dashboard)", "Inter", "sans-serif"]
      },
      borderRadius: {
        "2xl": "16px"
      }
    }
  },
  plugins: []
};

export default config;
