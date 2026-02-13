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

This is deployed on [Railway](https://railway.com) with the config in [`railway.json`](../railway.json). The Railway GitHub app is connected to the repo and deploys automatically on push to `main`. PR environments are created automatically for pull requests.

Environment variables are managed in the Railway dashboard. To pull them locally:

```
railway variables -k > .env.local
```

## Meta

This repo was bootstrapped from this:

```bash
npx create-next-app@latest
```

I added MDX by following [these instructions](https://nextjs.org/docs/app/building-your-application/configuring/mdx).
