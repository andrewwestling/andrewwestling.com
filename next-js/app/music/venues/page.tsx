import { getLocationsForVenues } from "@music/lib/location";
import { routes } from "@music/lib/routes";
import { IndexPage } from "@music/components/IndexPage";
import { getVenues } from "@music/data/queries/venues";

export default async function VenuesPage() {
  const venues = getVenues();
  const locationMap = await getLocationsForVenues(venues);

  const items = venues.map((venue) => ({
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
