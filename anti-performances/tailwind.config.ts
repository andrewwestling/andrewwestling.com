import type { Config } from "tailwindcss";

export type AntiColor = {
  DEFAULT: string;
  dark?: string;
};

export const antiColors: {
  [color: string]: AntiColor;
} = {

  text: {
    DEFAULT: "#1a1a1a",
    dark: "#ffffff",
  },
  background: {
    DEFAULT: "#ffffff",
    dark: "#1a1a1a",
  },
  muted: {
    DEFAULT: "#737373",
    dark: "#a3a3a3",
  },
  highlight: {
    DEFAULT: "#e5e5e5",
    dark: "#404040",
  },
  accent: {
    DEFAULT: "#ffd700",
  },

};

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./mdx-components.tsx",
  ],
  theme: {
    extend: {
      colors: antiColors,
      maxWidth: {
        container: "50rem",
      },
    },
  },
  darkMode: "media",
  plugins: [],
};

export default config;
