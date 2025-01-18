import { Breadcrumbs } from "./components/Breadcrumbs";

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="py-4 flex flex-col gap-6">
      <Breadcrumbs />
      {children}
    </div>
  );
}
