import { notFound } from "next/navigation";
import Link from "next/link";
import {
  formatDate,
  findConductorSlug,
  formatConcertTitle,
  formatWorkTitle,
  formatComposerName,
  isUpcoming,
} from "@music/lib/helpers";
import { PageProps } from "@music/lib/types";
import { DidNotPlay } from "@music/components/DidNotPlay";
import { getLocationsForVenues } from "@music/lib/location";
import { routes } from "@music/lib/routes";
import type { Work } from "@music/lib/types";
import { ListItem } from "../../components/ListItem";
import { ExternalLink } from "../../components/ExternalLink";
import { getConcertBySlug } from "@music/data/queries/concerts";
import { getGroupByTitle } from "@music/data/queries/groups";
import { getWorkByTitle } from "@music/data/queries/works";
import { getVenueByTitle } from "@music/data/queries/venues";
import { Upcoming } from "../../components/Upcoming";

export default async function ConcertPage({ params }: PageProps) {
  const concert = getConcertBySlug(params.slug);
  if (!concert) {
    notFound();
  }

  // Find the referenced group
  const group = getGroupByTitle(concert.frontmatter.group);

  // Format the concert title
  const displayTitle = formatConcertTitle(concert.title, group);

  // Find the referenced conductor(s)
  const conductors = Array.isArray(concert.frontmatter.conductor)
    ? concert.frontmatter.conductor
    : concert.frontmatter.conductor
    ? [concert.frontmatter.conductor]
    : [];

  // Find the referenced works
  const works: string[] = concert.frontmatter.works || [];
  const workObjects = works
    .map((workTitle: string) => getWorkByTitle(workTitle))
    .filter((work): work is Work => work !== undefined);

  // Get venue and location if available
  const venue = concert.frontmatter.venue
    ? getVenueByTitle(concert.frontmatter.venue)
    : undefined;
  const locationMap = venue ? await getLocationsForVenues([venue]) : {};
  const location = venue ? locationMap[venue.slug] : undefined;

  return (
    <article>
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2 flex-wrap">
        {displayTitle}
        {concert.frontmatter.didNotPlay && <DidNotPlay />}
      </h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Details</h2>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
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
                  <span className="text-muted text-sm ml-2">({location})</span>
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

          {concert.frontmatter.ticketUrl &&
            isUpcoming(concert.frontmatter.date) && (
              <>
                <dt className="font-medium">Tickets</dt>
                <dd>
                  <ExternalLink
                    href={concert.frontmatter.ticketUrl}
                    className="text-primary"
                  >
                    Buy Tickets
                  </ExternalLink>
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
              <li key={work.slug}>
                <ListItem
                  title={formatWorkTitle(work)}
                  href={routes.works.show(work.slug)}
                  stats={[
                    work.frontmatter.composer &&
                      `by ${formatComposerName(work.frontmatter.composer)}`,
                  ]}
                  bucketList={work.bucketList}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {concert.frontmatter.spotifyPlaylistUrl && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Listen</h2>
          <iframe
            src={concert.frontmatter.spotifyPlaylistUrl.replace(
              "spotify.com/playlist",
              "spotify.com/embed/playlist"
            )}
            width="100%"
            height="400"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      )}
    </article>
  );
}
