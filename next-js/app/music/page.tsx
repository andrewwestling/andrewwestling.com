import Link from "next/link";
import database from "@music/data/database";
import { getDateFromFrontmatter, isUpcoming } from "@music/lib/helpers";
import { routes } from "@music/lib/routes";
import { ConcertListItem } from "@music/components/ConcertListItem";

export default async function HomePage() {
  // Get all concerts and sort them by date
  const allConcerts = [...database.concert].filter(
    (concert) => !concert.frontmatter.didNotPlay
  );

  // Split concerts into upcoming and past
  const upcomingConcerts = allConcerts
    .filter((concert) => isUpcoming(concert.frontmatter.date))
    .sort((a, b) => {
      const dateA = getDateFromFrontmatter(a);
      const dateB = getDateFromFrontmatter(b);
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime(); // Ascending for upcoming
    });

  const pastConcerts = allConcerts
    .filter((concert) => !isUpcoming(concert.frontmatter.date))
    .sort((a, b) => {
      const dateA = getDateFromFrontmatter(a);
      const dateB = getDateFromFrontmatter(b);
      if (!dateA || !dateB) return 0;
      return dateB.getTime() - dateA.getTime(); // Descending for past
    });

  return (
    <div>
      <div className="grid gap-12">
        {/* Concerts */}
        <section>
          {/* Upcoming Concerts */}
          {upcomingConcerts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Upcoming concerts</h3>
              <div className="grid gap-4">
                {upcomingConcerts.map((concert) => (
                  <ConcertListItem key={concert.slug} concert={concert} />
                ))}
              </div>
            </div>
          )}

          {/* Past Concerts */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Past concerts</h3>
            <div className="grid gap-4">
              {pastConcerts.slice(0, 5).map((concert) => (
                <ConcertListItem key={concert.slug} concert={concert} />
              ))}
              {pastConcerts.length > 5 && (
                <div className="mt-2">
                  <Link
                    href={routes.concerts.index()}
                    className="text-sm text-muted"
                  >
                    View all {allConcerts.length} concerts →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
