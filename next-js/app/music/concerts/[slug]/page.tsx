import { notFound } from "next/navigation";
import Link from "next/link";
import database from "@music/data/database";
import {
  formatDate,
  findConductorSlug,
  formatConcertTitle,
} from "@music/lib/helpers";
import { PageProps } from "@music/lib/types";
import { DidNotPlay } from "@music/components/DidNotPlay";
import {
  getLocationsForVenues,
  findVenueFromFrontmatter,
} from "@music/lib/location";
import { routes } from "@music/lib/routes";

export default async function ConcertPage({ params }: PageProps) {
  // Find concert by matching the date portion of the slug
  const concert = database.concert.find((c) => c.slug === params.slug);
  if (!concert) {
    notFound();
  }

  // Find the referenced group
  const group = database.group.find(
    (g) => g.title === concert.frontmatter.group
  );

  // Format the concert title
  const displayTitle = formatConcertTitle(concert.title, group);

  // Find the referenced conductor(s)
  const conductors = Array.isArray(concert.frontmatter.conductor)
    ? concert.frontmatter.conductor
    : concert.frontmatter.conductor
    ? [concert.frontmatter.conductor]
    : [];

  // Find the referenced works
  const works = concert.frontmatter.works
    ? Array.isArray(concert.frontmatter.works)
      ? concert.frontmatter.works
      : [concert.frontmatter.works]
    : [];
  const workObjects = works
    .map((workTitle) => database.work.find((w) => w.title === workTitle))
    .filter(Boolean);

  // Get venue location if available
  const locationMap = await getLocationsForVenues(database.venue);
  const venue = findVenueFromFrontmatter(
    concert.frontmatter.venue,
    database.venue
  );
  let location = venue ? locationMap[venue.slug] : null;

  // Fall back to group location if no venue location
  if (!location && group?.frontmatter.location) {
    location = group.frontmatter.location;
  }

  return (
    <article className="py-8">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2 flex-wrap">
        {displayTitle}
        {concert.frontmatter.didNotPlay && <DidNotPlay />}
      </h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Details</h2>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
          <dt className="font-medium">Date</dt>
          <dd>{formatDate(concert.frontmatter.date)}</dd>

          <dt className="font-medium">Group</dt>
          <dd>
            {group && (
              <Link href={routes.groups.show(group.slug)}>{group.title}</Link>
            )}
          </dd>

          {venue && (
            <>
              <dt className="font-medium">Venue</dt>
              <dd>
                <Link href={routes.venues.show(venue.slug)}>{venue.title}</Link>
                {location && (
                  <span className="text-muted ml-2">({location})</span>
                )}
              </dd>
            </>
          )}

          {conductors.length > 0 && (
            <>
              <dt className="font-medium">
                Conductor{conductors.length > 1 ? "s" : ""}
              </dt>
              <dd>
                {conductors.map((conductorName, i) => (
                  <span key={conductorName}>
                    {i > 0 && ", "}
                    <Link
                      href={routes.conductors.show(
                        findConductorSlug(conductorName) || ""
                      )}
                    >
                      {conductorName}
                    </Link>
                  </span>
                ))}
              </dd>
            </>
          )}
        </dl>
      </div>

      {workObjects.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Program</h2>
          <ul className="list-disc list-inside">
            {workObjects.map((work) => (
              <li key={work?.slug}>
                <Link href={routes.works.show(work?.slug || "")}>
                  {work?.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
