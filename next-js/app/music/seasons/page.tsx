import database from "@music/data/database";
import { sortSeasons } from "@music/lib/helpers";
import { Season } from "@music/lib/types";
import { SeasonListItem } from "@music/components/SeasonListItem";

export default function SeasonsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Seasons</h1>

      <div className="grid gap-4">
        {sortSeasons<Season>(database.season).map((season) => (
          <SeasonListItem key={season.slug} season={season} />
        ))}
      </div>
    </div>
  );
}
