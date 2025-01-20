import { Breadcrumbs } from "./components/Breadcrumbs";
import { Suspense } from "react";

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs />
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  );
}
