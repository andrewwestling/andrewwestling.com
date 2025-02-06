# JSON Resume Theme - Andrew Westling (Tailwind/JSX)

A modern, responsive theme for [JSON Resume](https://jsonresume.org) built with Tailwind CSS and React/JSX.

## Features

- Modern, responsive design
- Dark mode support
- Typography presets for consistent text styling
- Built with Tailwind CSS for utility-first styling
- React/JSX components for maintainable code
- TypeScript for type safety

## Installation

```bash
npm install jsonresume-theme-andrewwestling-tw
```

## Usage

### With resume-cli

```bash
resume export resume.html --theme andrewwestling-tw
```

### Programmatically

```javascript
import render from "jsonresume-theme-andrewwestling-tw";

const html = render(resumeJson);
```

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Build for production: `npm run build`

## License

MIT
