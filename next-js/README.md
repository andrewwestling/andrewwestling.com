# andrewwestling.com with Next.js

This is my static homepage written with Next.js, TypeScript, MDX, and Tailwind.

## Setup

To get up and running in development, run these inside this folder:

```
npm install
npm run dev
```

I also have [VS Code Tasks](https://code.visualstudio.com/docs/editor/tasks) set up in this repo, so you can run the "Start" command and it should get everything up and running.

## Theme

The theme configuration is imported from `@andrewwestling/tailwind-config` and used in [`tailwind.config.ts`](tailwind.config.ts). It's not precious, and I change my mind sometimes.

## Deployment

I'm using Vercel to deploy this. I just followed their instructions. I'm using the Next.js preset and I linked to the GitHub repo from their site.

## Meta

This repo was bootstrapped from this:

```bash
npx create-next-app@latest
```

I added MDX by following [these instructions](https://nextjs.org/docs/app/building-your-application/configuring/mdx).
