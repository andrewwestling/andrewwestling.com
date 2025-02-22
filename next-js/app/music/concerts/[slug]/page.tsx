import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  formatDate,
  findConductorSlug,
  formatConcertTitle,
  formatWorkTitle,
  formatComposerName,
  isUpcoming,
  getNextConcert,
  getPreviousConcert,
} from "@music/lib/helpers";
import { PageProps } from "@music/lib/types";
import { getLocationsForVenues } from "@music/lib/location";
import { routes } from "@music/lib/routes";
import type { Work } from "@music/lib/types";
import { ListItem } from "@music/components/ListItem";
import { getConcertBySlug } from "@music/data/queries/concerts";
import { getGroupByTitle } from "@music/data/queries/groups";
import { getWorkByTitle } from "@music/data/queries/works";
import { getVenueByTitle } from "@music/data/queries/venues";
import { ConcertBadges } from "@music/components/ConcertBadges";
import { SectionHeading } from "@music/components/SectionHeading";
import { PageTitle } from "@music/components/PageTitle";
import { BucketList } from "@music/components/BucketList";
import { AttendActions } from "@music/components/AttendActions";
import { BackForwardNavigation } from "@music/components/BackForwardNavigation";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const concert = getConcertBySlug(decodeURIComponent(params.slug));
  if (!concert) return { title: "Not Found" };

  const group = getGroupByTitle(concert.frontmatter.group);

  return {
    title: formatConcertTitle(concert.title, group),
    description: `Concert details for ${formatConcertTitle(
      concert.title,
      group
    )} on ${formatDate(concert.frontmatter.date)}`,
  };
}

export default async function ConcertPage(props: PageProps) {
  const params = await props.params;
  const concert = getConcertBySlug(params.slug);
  if (!concert) {
    notFound();
  }

  // Find the referenced group
  const group = getGroupByTitle(concert.frontmatter.group);

  // Format the concert title
  const displayTitle = formatConcertTitle(concert.title, group);

  // Get next/prev concerts
  const prevConcert = getPreviousConcert(concert.slug);
  const nextConcert = getNextConcert(concert.slug);

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
    <article className="flex flex-col gap-6">
      <div className="flex flex-row items-start justify-between gap-4">
        <PageTitle>{displayTitle}</PageTitle>
        <div className="hidden sm:block">
          <BackForwardNavigation
            prev={prevConcert}
            next={nextConcert}
            getHref={(concert) => routes.concerts.show(concert.slug)}
            getTooltip={(concert) =>
              formatConcertTitle(
                concert.title,
                getGroupByTitle(concert.frontmatter.group)
              )
            }
          />
        </div>
      </div>

      {isUpcoming(concert) && (
        <div className="mb-6">
          <SectionHeading>Attend</SectionHeading>
          <AttendActions concert={concert} />
        </div>
      )}

      <div className="mb-6">
        <SectionHeading>Details</SectionHeading>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          <dt className="font-medium">Date</dt>
          <dd className="flex items-center gap-2">
            {formatDate(concert.frontmatter.date)}{" "}
            <ConcertBadges concert={concert} />
          </dd>

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
        </dl>
      </div>

      {workObjects.length > 0 && (
        <div>
          <SectionHeading>Program</SectionHeading>
          <div className="flex flex-col gap-2">
            {workObjects.map((work) => {
              // Find program details for this work if they exist
              const programDetails = concert.frontmatter.programDetails?.find(
                (details) => details.work.slug === work.slug
              );

              return (
                <div key={work.slug} className="flex flex-col gap-1">
                  <ListItem
                    title={formatWorkTitle(work)}
                    href={routes.works.show(work.slug)}
                    stats={[
                      work.frontmatter.composer &&
                        `by ${formatComposerName(work.frontmatter.composer)}`,
                    ]}
                    badges={[
                      work.bucketList ? (
                        <BucketList played={work.concertCount > 0} />
                      ) : null,
                    ]}
                  />

                  {/* Show program details if they exist */}
                  {programDetails && (
                    <div className="ml-4 text-sm text-muted gap-2 flex flex-col">
                      {/* Show movements if any */}
                      {programDetails.movements &&
                        programDetails.movements.length > 0 && (
                          <div>
                            <ul className="list-inside">
                              {programDetails.movements.map((movement) => (
                                <li
                                  key={movement}
                                  dangerouslySetInnerHTML={{ __html: movement }}
                                />
                              ))}
                            </ul>
                          </div>
                        )}
                      {/* Show work-specific conductor if different from concert conductor */}
                      {programDetails.conductor && (
                        <div>
                          <Link
                            href={routes.conductors.show(
                              findConductorSlug(programDetails.conductor) || ""
                            )}
                          >
                            {programDetails.conductor}
                          </Link>
                          , conductor
                        </div>
                      )}

                      {/* Show soloists if any */}
                      {programDetails.soloists &&
                        programDetails.soloists.length > 0 && (
                          <div>
                            <ul className="list-inside">
                              {programDetails.soloists.map((soloist) => (
                                <li key={soloist}>{soloist}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {concert.frontmatter.spotifyPlaylistUrl && (
        <div className="mt-6">
          <SectionHeading>Listen</SectionHeading>
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
