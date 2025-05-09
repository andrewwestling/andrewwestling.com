import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BackForwardNavigation } from "@music/components/BackForwardNavigation";
import { BucketList } from "@music/components/BucketList";
import { ConcertInfo } from "@music/components/ConcertInfo";
import { ListItem } from "@music/components/ListItem";
import { SectionHeading } from "@music/components/SectionHeading";
import {
  getConcertBySlug,
  getGroupByTitle,
  getWorkByTitle,
  getVenueByTitle,
} from "@music/data/queries";
import type { PageProps } from "@music/data/types";
import type { Work } from "@music/data/types";
import {
  formatDate,
  findConductorSlug,
  formatConcertTitle,
  formatWorkTitle,
  formatComposerName,
  getNextConcert,
  getPreviousConcert,
} from "@music/lib/helpers";
import { routes } from "@music/lib/routes";

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

  // Get next/prev concerts
  const prevConcert = getPreviousConcert(concert.slug);
  const nextConcert = getNextConcert(concert.slug);

  // Find the referenced works
  const works: string[] = concert.frontmatter.works || [];
  const workObjects = works
    .map((workTitle: string) => getWorkByTitle(workTitle))
    .filter((work): work is Work => work !== undefined);

  // Get venue if available
  const venue = concert.frontmatter.venue
    ? getVenueByTitle(concert.frontmatter.venue)
    : undefined;

  return (
    <article className="space-y-12">
      <div className="flex flex-row items-start justify-between gap-4">
        <ConcertInfo concert={concert} showAttendActions titleAsLink={false} />
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

      {workObjects.length > 0 && (
        <div>
          <SectionHeading>Program</SectionHeading>
          <div className="flex flex-col gap-2">
            {concert.frontmatter.programDetails?.map((programDetails) => {
              const work = programDetails.work;
              return (
                <div
                  key={`${work.slug}-${programDetails.movements?.[0]}`}
                  className="flex flex-col gap-1"
                >
                  <ListItem
                    title={formatWorkTitle(work)}
                    href={routes.works.show(work.slug)}
                    stats={[
                      work.frontmatter.composer &&
                        `by ${formatComposerName(work.frontmatter.composer)}`,
                    ]}
                    titleBadges={[
                      work.bucketList ? (
                        <BucketList played={work.concertCount > 0} />
                      ) : null,
                    ]}
                  />

                  {/* Show program details if they exist */}
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
                </div>
              );
            })}
          </div>
        </div>
      )}

      {concert.frontmatter.spotifyPlaylistUrl && (
        <div>
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
