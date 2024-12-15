"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import database from "@music/data/database";
import { routes } from "@music/lib/routes";

export function Navigation() {
  const pathname = usePathname();

  const getLinkClassName = (path: string) => {
    return pathname === path
      ? "text-primary font-medium"
      : "text-muted hover:text-primary transition-colors";
  };

  return (
    <nav>
      <div className="flex flex-wrap gap-4 text-xs">
        <Link href={routes.home()} className={getLinkClassName(routes.home())}>
          Home
        </Link>
        <Link
          href={routes.concerts.index()}
          className={getLinkClassName(routes.concerts.index())}
        >
          Concerts ({database.concert.length})
        </Link>
        <Link
          href={routes.works.index()}
          className={getLinkClassName(routes.works.index())}
        >
          Works ({database.work.length})
        </Link>
        <Link
          href={routes.composers.index()}
          className={getLinkClassName(routes.composers.index())}
        >
          Composers ({database.composer.length})
        </Link>
        <Link
          href={routes.conductors.index()}
          className={getLinkClassName(routes.conductors.index())}
        >
          Conductors ({database.conductor.length})
        </Link>
        <Link
          href={routes.groups.index()}
          className={getLinkClassName(routes.groups.index())}
        >
          Groups ({database.group.length})
        </Link>
        <Link
          href={routes.venues.index()}
          className={getLinkClassName(routes.venues.index())}
        >
          Venues ({database.venue.length})
        </Link>
        <Link
          href={routes.seasons.index()}
          className={getLinkClassName(routes.seasons.index())}
        >
          Seasons ({database.season.length})
        </Link>
      </div>
    </nav>
  );
}
