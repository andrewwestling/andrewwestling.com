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
