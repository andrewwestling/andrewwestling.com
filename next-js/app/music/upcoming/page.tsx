import Link from "next/link";
import database from "@music/data/database";
import {
  getDateFromFrontmatter,
  isUpcoming,
  getCurrentSeasonSlug,
} from "@music/lib/helpers";
import { ConcertListItem } from "@music/components/ConcertListItem";

export default async function HomePage() {
  // Get all concerts and sort them by date
  let allConcerts = [...database.concert].filter(
    (concert) => !concert.frontmatter.didNotPlay
  );

  const upcomingConcerts = allConcerts
    .filter((concert) => isUpcoming(concert.frontmatter.date))
    .sort((a, b) => {
      const dateA = getDateFromFrontmatter(a);
      const dateB = getDateFromFrontmatter(b);
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime(); // Ascending for upcoming
    });

  return (
    <div className="grid gap-6">
      {/* Up Next */}
      {upcomingConcerts.length > 0 && (
        <section>
          <h1 className="text-2xl font-semibold mb-4">Up Next</h1>
          <div className="grid gap-4">
            {upcomingConcerts.slice(0, 1).map((concert) => (
              <ConcertListItem key={concert.slug} concert={concert} expanded />
            ))}
          </div>
        </section>
      )}

      {/* This Season */}
      {upcomingConcerts.length > 1 && (
        <section>
          <h1 className="text-2xl font-semibold mb-4">Later This Season</h1>
          {upcomingConcerts.length > 0 && (
            <div className="grid gap-4">
              {upcomingConcerts.slice(1).map((concert) => (
                <ConcertListItem key={concert.slug} concert={concert} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* If no more concerts, show a message */}
      {upcomingConcerts.length === 0 && (
        <section>
          <p>No more concerts scheduled for this season. Check back soon!</p>
        </section>
      )}
    </div>
  );
}
