import { notFound } from "next/navigation";

/** Flip to true when the write-up is reviewed and ready to publish. */
const published = true;

export default function MusicLibraryProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!published && process.env.VERCEL_ENV === "production") {
    notFound();
  }

  return children;
}
