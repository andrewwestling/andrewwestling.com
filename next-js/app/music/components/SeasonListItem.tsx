import Link from "next/link";
import { routes } from "@music/lib/routes";
import { Season } from "@music/lib/types";
import database from "@music/data/database";

interface SeasonListItemProps {
  season: Season;
}

export function SeasonListItem({ season }: SeasonListItemProps) {
  const concerts = season.concertSlugs
    .map((concertSlug: string) =>
      database.concert.find((c) => c.slug === concertSlug)
    )
    .filter(Boolean);

  const works = season.workSlugs
    .map((workSlug: string) => database.work.find((w) => w.slug === workSlug))
    .filter(Boolean);

  return (
    <div>
      <Link href={routes.seasons.show(season.slug)} className="font-semibold">
        {season.title}
      </Link>
      <span className="text-muted text-sm ml-2">
        <>
          {concerts.length} concert{concerts.length !== 1 ? "s" : ""}
        </>
        {" • "}
        <>
          {works.length} work{works.length !== 1 ? "s" : ""}
        </>
      </span>
    </div>
  );
}
