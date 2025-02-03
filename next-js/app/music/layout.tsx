import { Suspense } from "react";

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 pb-24 mt-6">
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  );
}
