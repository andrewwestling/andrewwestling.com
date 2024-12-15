import { Navigation } from "./components/Navigation";

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="py-4 flex flex-col gap-8">
      <Navigation />
      {children}
    </div>
  );
}
