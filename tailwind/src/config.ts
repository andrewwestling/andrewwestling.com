import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";
import type { AwdsColor } from "./colors";
import { awdsColors } from "./colors";

export { awdsColors, type AwdsColor };

export function createConfig(contentPaths: string[]): Config {
  return {
    important: true,
    darkMode: "media",
    content: contentPaths,
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
}
