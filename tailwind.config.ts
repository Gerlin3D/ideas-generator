import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        border: "rgba(148, 163, 184, 0.16)",
        input: "rgba(15, 23, 42, 0.7)",
        ring: "#7dd3fc",
        background: "#020617",
        foreground: "#e2e8f0",
        muted: "#0f172a",
        "muted-foreground": "#94a3b8",
        card: "rgba(15, 23, 42, 0.76)",
        "card-foreground": "#e2e8f0",
        primary: "#38bdf8",
        "primary-foreground": "#082f49",
      },
      backgroundImage: {
        "lab-grid":
          "radial-gradient(circle at top, rgba(56, 189, 248, 0.14), transparent 50%), radial-gradient(circle at bottom left, rgba(218, 112, 214, 0.1), transparent 50%), linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)",
      },
      backgroundSize: {
        "lab-grid": "auto, auto, 40px 40px, 40px 40px",
      },
      boxShadow: {
        panel: "0 24px 60px rgba(2, 6, 23, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
