import Link from "next/link";
import { routes } from "./lib/routes";

export default async function HomePage() {
  const linkClasses =
    "bg-surface dark:bg-surface-dark p-3 rounded-md cursor-pointer";

  return (
    <div className="grid gap-8">
      <section>
        <h1 className="text-2xl font-semibold">Andrew's Music Archive</h1>
        <label className="text-sm text-muted italic">
          "Probably every concert and work I've ever performed"
        </label>
      </section>

      {/* Browse links */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Concerts */}
        <Link className={linkClasses} href={routes.upcoming()}>
          Upcoming Concerts
        </Link>
        {/* All Seasons */}
        <Link className={linkClasses} href={routes.seasons.index()}>
          All Seasons
        </Link>
        {/* All Concerts */}
        <Link className={linkClasses} href={routes.concerts.index()}>
          All Concerts
        </Link>
        {/* All Works */}
        <Link className={linkClasses} href={routes.works.index()}>
          All Works
        </Link>
      </div>
    </div>
  );
}
