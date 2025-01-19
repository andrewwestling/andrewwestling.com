import database from "@music/data/database";
import { PageProps } from "@music/lib/types";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { getLocationsForVenues } from "../../lib/location";
import { getDateForSorting } from "../../lib/helpers";

// Import the map component dynamically to avoid SSR issues
const VenueMap = dynamic(() => import("@music/components/VenueMap"), {
  ssr: false,
});

export default async function VenuePage({ params }: PageProps) {
  const venue = database.venue.find((v) => v.slug === params.slug);
  if (!venue) notFound();

  const locationMap = await getLocationsForVenues(database.venue);
  const location = locationMap[venue.slug];

  // Get all concerts at this venue, excluding didNotPlay ones
  const concerts = database.concert
    .filter(
      (c) => !c.frontmatter.didNotPlay && c.frontmatter.venue === venue.title
    )
    .sort((a, b) => {
      const dateA = getDateForSorting(a.frontmatter.date);
      const dateB = getDateForSorting(b.frontmatter.date);
      return dateB - dateA; // Sort descending (newest first)
    });

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-4xl font-bold">{venue.title}</h1>
        <div className="text-muted text-sm">
          {location && <>{location}</>}
          {location && concerts.length > 0 && " • "}
          {concerts.length > 0 && (
            <>
              {concerts.length} concert
              {concerts.length !== 1 ? "s" : ""}
            </>
          )}
        </div>
      </div>

      <div className="grid gap-8">
        {/* Venue Details */}
        <section>
          {venue.frontmatter.coordinates && (
            <VenueMap
              coordinates={venue.frontmatter.coordinates}
              venueName={venue.title}
            />
          )}
        </section>

        {/* Concerts */}
        {concerts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Concerts</h2>
            <div className="grid gap-4">
              {concerts.map((concert) => (
                <ConcertListItem key={concert.slug} concert={concert} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return database.venue.map((venue) => ({
    slug: venue.slug,
  }));
}
