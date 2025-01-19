import database from "@music/data/database";
import { getLocationsForVenues } from "@music/lib/location";
import { routes } from "@music/lib/routes";
import { IndexPage } from "@music/components/IndexPage";

export default async function VenuesPage() {
  const locationMap = await getLocationsForVenues(database.venue);
  const items = database.venue.map((venue) => ({
    slug: venue.slug,
    title: venue.title,
    href: routes.venues.show(venue.slug),
    stats: [
      locationMap[venue.slug],
      `${venue.concertCount} concert${venue.concertCount !== 1 ? "s" : ""}`,
    ].filter((stat): stat is string => stat !== null),
    sortableFields: {
      concerts: venue.concertCount,
    },
  }));

  return <IndexPage title="Venues" items={items} />;
}
