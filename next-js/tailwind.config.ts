import { createConfig } from "@andrewwestling/tailwind-config";

export default createConfig([
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./mdx-components.tsx",
]);
