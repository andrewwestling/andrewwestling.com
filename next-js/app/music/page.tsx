import Link from "next/link";
import database from "@music/data/database";
import {
  getDateFromFrontmatter,
  isUpcoming,
  getCurrentSeasonSlug,
} from "@music/lib/helpers";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { QuickLinks } from "./components/QuickLinks";

export default async function HomePage() {
  // Get all concerts and sort them by date
  let allConcerts = [...database.concert].filter(
    (concert) => !concert.frontmatter.didNotPlay
  );

  // If no filters, show the default home page layout
  const upcomingConcerts = allConcerts
    .filter((concert) => isUpcoming(concert.frontmatter.date))
    .sort((a, b) => {
      const dateA = getDateFromFrontmatter(a);
      const dateB = getDateFromFrontmatter(b);
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime(); // Ascending for upcoming
    });

  // Get current season
  const currentSeasonSlug = getCurrentSeasonSlug(database.season);
  const currentSeason = currentSeasonSlug
    ? database.season.find((s) => s.slug === currentSeasonSlug)
    : null;

  // Get current season concerts
  const currentSeasonConcerts = currentSeason
    ? currentSeason.concertSlugs
        .map((slug) => database.concert.find((c) => c.slug === slug))
        .filter(Boolean)
    : [];

  return (
    <div className="grid gap-6">
      <QuickLinks />
      {/* Up Next */}
      {upcomingConcerts.length > 0 && (
        <section>
          <h1 className="text-2xl font-semibold mb-4">Up Next</h1>
          <div className="grid gap-4">
            {upcomingConcerts.slice(0, 2).map((concert) => (
              <ConcertListItem key={concert.slug} concert={concert} expanded />
            ))}
          </div>
        </section>
      )}

      {/* This Season */}
      {currentSeason && (
        <section>
          <h1 className="text-2xl font-semibold mb-4">This Season</h1>
          {currentSeasonConcerts.length > 0 && (
            <div className="grid gap-4">
              {currentSeasonConcerts.map(
                (concert) =>
                  concert && (
                    <ConcertListItem key={concert.slug} concert={concert} />
                  )
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
