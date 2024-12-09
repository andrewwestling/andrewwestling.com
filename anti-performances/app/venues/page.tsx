import Link from "next/link";
import database from "@/database";
import { getLocationsForVenues } from "@/lib/location";

export default async function VenuesPage() {
  const locationMap = await getLocationsForVenues(database.venue);

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-8">Venues</h1>

      <div className="grid gap-8">
        {database.venue.map((venue) => {
          const concerts = database.concert.filter(
            (c) => c.frontmatter.venue === `[[${venue.title}]]`
          );

          const location = locationMap[venue.slug];

          return (
            <div key={venue.slug} className="grid gap-2">
              <div>
                <h2 className="text-2xl font-bold">
                  <Link href={`/venues/${venue.slug}`}>{venue.title}</Link>
                </h2>
                {location && (
                  <div className="text-muted text-sm mt-1">{location}</div>
                )}
              </div>

              {concerts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Concerts</h3>
                  <div className="grid gap-2">
                    {concerts.map((concert) => {
                      const group = database.group.find(
                        (g) => g.title === concert.frontmatter.group
                      );
                      return (
                        <div key={concert.slug}>
                          <Link href={`/concerts/${concert.slug}`}>
                            {concert.title}
                          </Link>
                          {group && (
                            <span className="text-muted ml-2">
                              with{" "}
                              <Link href={`/groups/${group.slug}`}>
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
