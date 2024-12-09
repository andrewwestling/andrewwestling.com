import Link from "next/link";
import database from "@music/data/database";
import { getDateFromFilename, formatConcertTitle } from "@music/lib/helpers";
import { DidNotPlay } from "@music/components/DidNotPlay";
import {
  getLocationsForVenues,
  findVenueFromFrontmatter,
} from "@music/lib/location";
import { routes } from "@music/lib/routes";

export default async function HomePage() {
  const locationMap = await getLocationsForVenues(database.venue);

  // Sort concerts by date (most recent first)
  const sortedConcerts = [...database.concert].sort((a, b) => {
    const dateA = getDateFromFilename(a.slug) || "";
    const dateB = getDateFromFilename(b.slug) || "";
    return dateB.localeCompare(dateA);
  });

  return (
    <div className="py-8">
      <div className="grid gap-12">
        {/* Concerts */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            <Link href={routes.concerts.index()}>Concerts</Link>
          </h2>
          <div className="grid gap-4">
            {sortedConcerts.slice(0, 5).map((concert) => {
              const group = database.group.find(
                (g) => g.title === concert.frontmatter.group
              );
              const displayTitle = formatConcertTitle(concert.title, group);

              return (
                <div key={concert.slug} className="flex items-center gap-2">
                  <Link href={routes.concerts.show(concert.slug)}>
                    {displayTitle}
                  </Link>
                  {concert.frontmatter.didNotPlay && <DidNotPlay />}
                </div>
              );
            })}
            {sortedConcerts.length > 5 && (
              <div className="mt-2">
                <Link
                  href={routes.concerts.index()}
                  className="text-sm text-muted"
                >
                  View all {sortedConcerts.length} concerts →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Groups */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            <Link href={routes.groups.index()}>Groups</Link>
          </h2>
          <div className="grid gap-4">
            {database.group.map((group) => (
              <div key={group.slug}>
                <Link href={routes.groups.show(group.slug)}>{group.title}</Link>
                {group.frontmatter.location && (
                  <span className="text-muted ml-2">
                    {group.frontmatter.location}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Conductors */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            <Link href={routes.conductors.index()}>Conductors</Link>
          </h2>
          <div className="grid gap-4">
            {database.conductor.map((conductor) => (
              <div key={conductor.slug}>
                <Link href={routes.conductors.show(conductor.slug)}>
                  {conductor.title}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Works */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            <Link href={routes.works.index()}>Works</Link>
          </h2>
          <div className="grid gap-4">
            {database.work.slice(0, 5).map((work) => {
              const composer = database.composer.find(
                (c) => c.title === work.frontmatter.composer
              );
              return (
                <div key={work.slug}>
                  <Link href={routes.works.show(work.slug)}>{work.title}</Link>
                  {composer && (
                    <span className="text-muted ml-2">
                      by{" "}
                      <Link href={routes.composers.show(composer.slug)}>
                        {composer.title}
                      </Link>
                    </span>
                  )}
                </div>
              );
            })}
            {database.work.length > 5 && (
              <div className="mt-2">
                <Link
                  href={routes.works.index()}
                  className="text-sm text-muted"
                >
                  View all {database.work.length} works →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Composers */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            <Link href={routes.composers.index()}>Composers</Link>
          </h2>
          <div className="grid gap-4">
            {database.composer.map((composer) => {
              const works = database.work.filter(
                (w) => w.frontmatter.composer === composer.title
              );
              return (
                <div key={composer.slug}>
                  <Link href={routes.composers.show(composer.slug)}>
                    {composer.title}
                  </Link>
                  <span className="text-muted ml-2">
                    ({works.length} work{works.length !== 1 ? "s" : ""})
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Venues */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            <Link href={routes.venues.index()}>Venues</Link>
          </h2>
          <div className="grid gap-4">
            {database.venue.map((venue) => {
              const location = locationMap[venue.slug];
              return (
                <div key={venue.slug}>
                  <Link href={routes.venues.show(venue.slug)}>
                    {venue.title}
                  </Link>
                  {location && (
                    <span className="text-muted ml-2">{location}</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
