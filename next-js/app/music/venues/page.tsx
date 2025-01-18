import database from "@music/data/database";
import { getLocationsForVenues } from "@music/lib/location";
import { routes } from "@music/lib/routes";
import { IndexPage } from "@music/components/IndexPage";

export default async function VenuesPage() {
  const locationMap = await getLocationsForVenues(database.venue);

  // Sort venues by concert count
  const sortedVenues = [...database.venue].sort(
    (a, b) => b.concertCount - a.concertCount
  );

  const items = sortedVenues.map((venue) => ({
    slug: venue.slug,
    title: venue.title,
    href: routes.venues.show(venue.slug),
    stats: [
      locationMap[venue.slug],
      `${venue.concertCount} concert${venue.concertCount !== 1 ? "s" : ""}`,
    ].filter((stat): stat is string => stat !== null),
  }));

  return <IndexPage title="Venues" items={items} />;
}
