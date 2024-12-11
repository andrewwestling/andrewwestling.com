import Link from "next/link";
import database from "@music/data/database";
import { getLocationsForVenues } from "@music/lib/location";
import { routes } from "@music/lib/routes";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { VenueStats } from "@music/components/VenueStats";

export default async function VenuesPage() {
  const locationMap = await getLocationsForVenues(database.venue);

  // Sort venues by concert count
  const sortedVenues = [...database.venue].sort(
    (a, b) => b.concertCount - a.concertCount
  );

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6">Venues</h1>

      <div className="grid gap-12">
        {sortedVenues.map((venue) => {
          const location = locationMap[venue.slug];

          return (
            <div
              key={venue.slug}
              className="grid gap-6 pb-8 border-b border-b-highlight"
            >
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">
                  <Link href={routes.venues.show(venue.slug)}>
                    {venue.title}
                  </Link>
                </h2>
                <VenueStats
                  location={location}
                  concertCount={venue.concertCount}
                />
              </div>

              {venue.concertCount > 0 && (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {database.concert
                      .filter(
                        (c) =>
                          !c.frontmatter.didNotPlay &&
                          c.frontmatter.venue === venue.title
                      )
                      .sort(
                        (a, b) =>
                          new Date(b.frontmatter.date).getTime() -
                          new Date(a.frontmatter.date).getTime()
                      )
                      .slice(0, 3)
                      .map((concert) => (
                        <ConcertListItem key={concert.slug} concert={concert} />
                      ))}
                    {venue.concertCount > 3 && (
                      <div>
                        <Link
                          href={routes.venues.show(venue.slug)}
                          className="text-sm text-muted"
                        >
                          View all {venue.concertCount} concerts →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
