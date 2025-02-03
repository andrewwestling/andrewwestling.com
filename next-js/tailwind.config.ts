import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";

export type AwdsColor = {
  DEFAULT: string;
  dark?: string;
};

export const awdsColors: {
  [color: string]: AwdsColor;
} = {
  text: {
    DEFAULT: "#050708",
    dark: "#dddddd",
  },
  background: {
    DEFAULT: "#ffffff",
    dark: "#050708",
  },
  muted: {
    DEFAULT: "#666666",
    dark: "#898989",
  },
  highlight: {
    DEFAULT: "#efefef",
    dark: "#333333",
  },
  primary: {
    DEFAULT: "#f1553a",
  },
  secondary: {
    DEFAULT: "#1d93b2",
  },
  tertiary: {
    DEFAULT: "#b8c05d",
  },
  accent: {
    DEFAULT: "#fcbb1a",
  },
  surface: {
    DEFAULT: "#efefef",
    dark: "#333333",
  },
  border: {
    DEFAULT: "#666666",
    dark: "#898989",
  },
  active: {
    DEFAULT: "#050708",
    dark: "#dddddd",
  },
  selected: {
    DEFAULT: "#f1553a",
    dark: "#f1553a",
  },
};

const config: Config = {
  important: true,
  darkMode: "media",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./mdx-components.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["system-ui", "sans-serif"],
      },
      colors: awdsColors,
      maxWidth: {
        container: "50rem",
      },
    },
  },
  plugins: [
    function ({ addBase, theme }: PluginAPI) {
      addBase({
        ":root": {
          "--color-text": theme("colors.text.DEFAULT"),
          "--color-background": theme("colors.background.DEFAULT"),
          "--color-muted": theme("colors.muted.DEFAULT"),
          "--color-highlight": theme("colors.highlight.DEFAULT"),
          "--color-primary": theme("colors.primary.DEFAULT"),
          "--color-secondary": theme("colors.secondary.DEFAULT"),
          "--color-tertiary": theme("colors.tertiary.DEFAULT"),
          "--color-accent": theme("colors.accent.DEFAULT"),
          "--color-surface": theme("colors.surface.DEFAULT"),
          "--color-border": theme("colors.border.DEFAULT"),
          "--color-active": theme("colors.active.DEFAULT"),
          "--color-selected": theme("colors.selected.DEFAULT"),
        },
        "@media (prefers-color-scheme: dark)": {
          ":root": {
            "--color-text": theme("colors.text.dark"),
            "--color-background": theme("colors.background.dark"),
            "--color-muted": theme("colors.muted.dark"),
            "--color-highlight": theme("colors.highlight.dark"),
            "--color-surface": theme("colors.surface.dark"),
            "--color-border": theme("colors.border.dark"),
            "--color-active": theme("colors.active.dark"),
            "--color-selected": theme("colors.selected.dark"),
          },
        },
      });
    },
    function ({ addUtilities }: PluginAPI) {
      addUtilities({
        ".scrollbar-hide": {
          /* Firefox */
          "scrollbar-width": "none",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
        },
      });
    },
  ],
};
export default config;
