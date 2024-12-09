import Link from "next/link";
import database from "@music/data/database";
import { getLocationsForVenues } from "@music/lib/location";
import { routes } from "@music/lib/routes";

export default async function VenuesPage() {
  const locationMap = await getLocationsForVenues(database.venue);

  // Sort venues by concert count
  const sortedVenues = [...database.venue].sort(
    (a, b) => b.concertCount - a.concertCount
  );

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6">Venues</h1>

      <div className="grid gap-8">
        {sortedVenues.map((venue) => {
          const location = locationMap[venue.slug];

          return (
            <div key={venue.slug} className="grid gap-2">
              <div>
                <h2 className="text-2xl font-bold">
                  <Link href={routes.venues.show(venue.slug)}>
                    {venue.title}
                  </Link>
                </h2>
                {location && (
                  <div className="text-muted text-sm mt-1">{location}</div>
                )}
                {venue.concertCount > 0 && (
                  <div className="text-muted text-sm">
                    {venue.concertCount} concert
                    {venue.concertCount !== 1 ? "s" : ""}
                  </div>
                )}
              </div>

              {venue.concertCount > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Recent Concerts
                  </h3>
                  <div className="grid gap-2">
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
                      .map((concert) => {
                        const group = database.group.find(
                          (g) => g.title === concert.frontmatter.group
                        );
                        return (
                          <div key={concert.slug}>
                            <Link href={routes.concerts.show(concert.slug)}>
                              {concert.title}
                            </Link>
                            {group && (
                              <span className="text-muted ml-2">
                                with{" "}
                                <Link href={routes.groups.show(group.slug)}>
                                  {group.title}
                                </Link>
                              </span>
                            )}
                          </div>
                        );
                      })}
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
