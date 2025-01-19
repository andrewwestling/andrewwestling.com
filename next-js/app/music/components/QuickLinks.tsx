import Link from "next/link";
import { routes } from "@music/lib/routes";

export function QuickLinks() {
  return (
    <nav className="text-sm">
      <div className="flex flex-row gap-3">
        <Link href={routes.home()}>Music</Link>
        <Link href={routes.concerts.index()}>All Concerts</Link>
        <Link href={routes.works.index()}>All Works</Link>
        <Link href={routes.seasons.index()}>All Seasons</Link>
      </div>
    </nav>
  );
}
