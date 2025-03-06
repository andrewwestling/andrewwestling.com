import { Metadata } from "next";
import type { PageProps } from "@music/data/types";
import { notFound } from "next/navigation";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { getLocationsForVenues } from "@music/lib/location";
import { getDateForSorting } from "@music/lib/helpers";
import { ExternalLink } from "@components/ExternalLink";
import { PageTitle } from "@music/components/PageTitle";
import { SectionHeading } from "@music/components/SectionHeading";
import VenueMap from "@music/components/VenueMap";
import { getVenueBySlug, getVenues } from "@music/data/queries/venues";
import { getConcertsByVenue } from "@music/data/queries/concerts";
import type { Venue } from "@music/data/types";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const venue = getVenueBySlug(decodeURIComponent(params.slug));
  if (!venue) return { title: "Not Found" };

  return {
    title: venue.title,
    description: `Concerts I've performed at ${venue.title}`,
  };
}

export default async function VenuePage(props: PageProps) {
  const params = await props.params;
  const venue = getVenueBySlug(params.slug);
  if (!venue) notFound();

  const locationMap = await getLocationsForVenues([venue]);
  const location = locationMap[venue.slug];

  // Get all concerts at this venue, excluding didNotPlay ones
  const concerts = getConcertsByVenue(venue.title)
    .filter((c) => !c.frontmatter.didNotPlay)
    .sort((a, b) => {
      const dateA = new Date(getDateForSorting(a.frontmatter.date));
      const dateB = new Date(getDateForSorting(b.frontmatter.date));
      return dateB.getTime() - dateA.getTime(); // Sort descending (newest first)
    });

  return (
    <article className="flex flex-col gap-6">
      <div>
        <PageTitle>{venue.title}</PageTitle>
        <p>
          {location && <>{location}</>}
          {location && concerts.length > 0 && " • "}
          {concerts.length > 0 && (
            <>
              {concerts.length} concert{concerts.length !== 1 ? "s" : ""}
            </>
          )}
          {venue.frontmatter.url && (
            <>
              {" • "}
              <ExternalLink href={venue.frontmatter.url}>{"Link"}</ExternalLink>
            </>
          )}
        </p>
      </div>

      {location && venue.frontmatter.coordinates && (
        <div>
          <SectionHeading>Location</SectionHeading>
          <VenueMap
            coordinates={venue.frontmatter.coordinates}
            venueName={venue.title}
          />
        </div>
      )}

      {concerts.length > 0 && (
        <div>
          <SectionHeading>Concerts</SectionHeading>
          <div className="grid gap-4">
            {concerts.map((concert) => (
              <ConcertListItem key={concert.slug} concert={concert} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

export function generateStaticParams() {
  const venues = getVenues();
  return venues.map((venue: Venue) => ({
    slug: venue.slug,
  }));
}
