import database from "@music/data/database";
import { sortSeasons } from "@music/lib/helpers";
import { Season } from "@music/lib/types";
import { routes } from "@music/lib/routes";
import { ListItem } from "@music/components/ListItem";

export default function SeasonsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Seasons</h1>

      <div className="grid gap-4">
        {sortSeasons<Season>(database.season).map((season) => {
          const concerts = season.concertSlugs.map((concertSlug: string) =>
            database.concert.find((c) => c.slug === concertSlug)
          );

          const works = season.workSlugs.map((workSlug: string) =>
            database.work.find((w) => w.slug === workSlug)
          );

          return (
            <ListItem
              key={season.slug}
              title={season.title}
              href={routes.seasons.show(season.slug)}
              stats={[
                `${concerts.length} concert${concerts.length !== 1 ? "s" : ""}`,
                `${works.length} work${works.length !== 1 ? "s" : ""}`,
              ]}
            />
          );
        })}
      </div>
    </div>
  );
}
