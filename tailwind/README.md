# Shared Tailwind Configuration

This package contains shared Tailwind CSS configuration, colors, and typography presets used across andrewwestling.com.

## Usage

1. Import the shared configuration in your `tailwind.config.ts`:

```typescript
import { createConfig } from "@andrewwestling/tailwind-config";

export default createConfig([
  // Add your content paths here
  "./src/**/*.{js,ts,jsx,tsx}",
]);
```

2. Import the shared styles in your CSS:

```css
@import "@andrewwestling/tailwind-config/src/globals.css";
```

## Features

- Shared color scheme with dark mode support
- Typography presets
- Base styles for links and text
- Markdown styles
- Common utility classes
