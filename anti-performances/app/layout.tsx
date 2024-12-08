import type { Metadata } from "next";
import { Header } from "./components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | anti-performances",
    default: "anti-performances",
  },
  description: "Archive of my musical performances",
  icons: {
    icon: "/assets/favicon/favicon-32x32.png",
    shortcut: "/assets/favicon/favicon.ico",
    apple: "/assets/favicon/apple-touch-icon.png",
  },
  manifest: "/assets/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-background dark:bg-background-dark text-text dark:text-text-dark">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <div className="max-w-container mx-auto w-full px-4">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
