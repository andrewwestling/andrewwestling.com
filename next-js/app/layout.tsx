import { awdsColors } from "@andrewwestling/tailwind-config";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata, Viewport } from "next";
import { Suspense } from "react";

import { Footer } from "@components/Footer";
import { GoatCounter } from "@components/GoatCounter";
import { Header } from "@components/Header";
import { Umami } from "@components/Umami";

import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: awdsColors.primary.DEFAULT,
};

export const metadata: Metadata = {
  title: {
    template: "%s | andrewwestling.com",
    default: "andrewwestling.com",
  },
  description: "Andrew M Westling is a software engineer in New York City.",
  icons: {
    icon: "/assets/favicon/favicon-32x32.png",
    shortcut: "/assets/favicon/favicon.ico",
    apple: "/assets/favicon/apple-touch-icon.png",
  },
  manifest: "/assets/favicon/site.webmanifest",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://andrewwestling.com",
  },
};

export default function App({
  children,
  breadcrumbs,
}: {
  children: React.ReactNode;
  breadcrumbs: React.ReactNode;
}) {
  return (
    <html>
      <body className="bg-background dark:bg-background-dark text-text dark:text-text-dark">
        <Suspense>
          <SpeedInsights />
          <GoatCounter />
          <Umami />
        </Suspense>
        <div className="flex flex-col min-h-screen">
          <Header>{breadcrumbs}</Header>
          <main className="flex-1">
            <div className="max-w-container mx-auto w-full px-4">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
