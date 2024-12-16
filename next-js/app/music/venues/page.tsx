import database from "@music/data/database";
import { getLocationsForVenues } from "@music/lib/location";
import { routes } from "@music/lib/routes";
import { ListItem } from "@music/components/ListItem";

export default async function VenuesPage() {
  const locationMap = await getLocationsForVenues(database.venue);

  // Sort venues by concert count
  const sortedVenues = [...database.venue].sort(
    (a, b) => b.concertCount - a.concertCount
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Venues</h1>

      <div className="grid gap-4">
        {sortedVenues.map((venue) => {
          return (
            <ListItem
              key={venue.slug}
              title={venue.title}
              href={routes.venues.show(venue.slug)}
              stats={[
                locationMap[venue.slug],
                `${venue.concertCount} concert${
                  venue.concertCount !== 1 ? "s" : ""
                }`,
              ]}
            />
          );
        })}
      </div>
    </div>
  );
}
