# jsonresume-theme-andrewwestling

A modern Tailwind/JSX theme for [JSON Resume](https://jsonresume.org/) standard, designed for
the [v1.0.0 version](https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json).

Features:

- Modern, clean design using Tailwind CSS
- Built with TypeScript and React/JSX
- Markdown support for text fields
- Responsive layout
- Print-friendly styling

## Table of contents

- [What is JSON Resume?](#what-is-json-resume)
- [Prerequisites](#prerequisites)
- [Export resume](#export-resume)
- [Development](#development)

## What is JSON Resume?

> JSON Resume is a community driven open source initiative to create JSON-based standard for resumes.

## Prerequisites

- [node.js](https://nodejs.org/en/) runtime with [resumed](https://github.com/rbardini/resumed)

```bash
npm install -g resumed
```

## Export resume

- Create your [resume.json](https://jsonresume.org/schema/) file
- Install and use the theme:

```bash
npm install jsonresume-theme-andrewwestling
resumed render resume.json -t jsonresume-theme-andrewwestling -o resume.html
```

You can also use the included development scripts to generate HTML and PDF versions:

```bash
npm run create-html
npm run create-pdf
```

## Development

```bash
# Install dependencies
npm install

# Build the theme
npm run build

# Development with watch mode
npm run dev
```

The development server will watch for changes in the TypeScript/JSX files and Tailwind CSS styles.
