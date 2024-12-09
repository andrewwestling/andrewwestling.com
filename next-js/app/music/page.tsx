import Link from "next/link";
import database from "@music/data/database";
import {
  getDateFromFilename,
  formatConcertTitle,
  isUpcoming,
} from "@music/lib/helpers";
import { ConcertBadges } from "@music/components/ConcertBadges";
import { getLocationsForVenues } from "@music/lib/location";
import { routes } from "@music/lib/routes";

export default async function HomePage() {
  const locationMap = await getLocationsForVenues(database.venue);

  // Get all concerts and sort them by date
  const allConcerts = [...database.concert].filter(
    (concert) => !concert.frontmatter.didNotPlay
  );

  // Split concerts into upcoming and past
  const upcomingConcerts = allConcerts
    .filter((concert) => isUpcoming(concert.frontmatter.date))
    .sort((a, b) => {
      const dateA = getDateFromFilename(a.slug) || "";
      const dateB = getDateFromFilename(b.slug) || "";
      return dateA.localeCompare(dateB); // Ascending for upcoming
    });

  const pastConcerts = allConcerts
    .filter((concert) => !isUpcoming(concert.frontmatter.date))
    .sort((a, b) => {
      const dateA = getDateFromFilename(a.slug) || "";
      const dateB = getDateFromFilename(b.slug) || "";
      return dateB.localeCompare(dateA); // Descending for past
    });

  // Sort entities by concert count
  const sortedWorks = [...database.work].sort(
    (a, b) => b.concertCount - a.concertCount
  );

  const sortedVenues = [...database.venue].sort(
    (a, b) => b.concertCount - a.concertCount
  );

  const sortedGroups = [...database.group].sort(
    (a, b) => b.concertCount - a.concertCount
  );

  const sortedConductors = [...database.conductor].sort(
    (a, b) => b.concertCount - a.concertCount
  );

  const sortedComposers = [...database.composer].sort(
    (a, b) => b.concertCount - a.concertCount
  );

  return (
    <div className="py-8">
      <div className="grid gap-12">
        {/* Concerts */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            <Link href={routes.concerts.index()}>Concerts</Link>
          </h2>

          {/* Upcoming Concerts */}
          {upcomingConcerts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Upcoming concerts</h3>
              <div className="grid gap-4">
                {upcomingConcerts.map((concert) => {
                  const group = database.group.find(
                    (g) => g.title === concert.frontmatter.group
                  );
                  const displayTitle = formatConcertTitle(concert.title, group);

                  return (
                    <div key={concert.slug} className="flex items-center gap-2">
                      <Link href={routes.concerts.show(concert.slug)}>
                        {displayTitle}
                      </Link>
                      <ConcertBadges concert={concert} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Past Concerts */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Past concerts</h3>
            <div className="grid gap-4">
              {pastConcerts.slice(0, 5).map((concert) => {
                const group = database.group.find(
                  (g) => g.title === concert.frontmatter.group
                );
                const displayTitle = formatConcertTitle(concert.title, group);

                return (
                  <div key={concert.slug} className="flex items-center gap-2">
                    <Link href={routes.concerts.show(concert.slug)}>
                      {displayTitle}
                    </Link>
                    <ConcertBadges concert={concert} />
                  </div>
                );
              })}
              {pastConcerts.length > 5 && (
                <div className="mt-2">
                  <Link
                    href={routes.concerts.index()}
                    className="text-sm text-muted"
                  >
                    View all {pastConcerts.length} past concerts →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Groups */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            <Link href={routes.groups.index()}>Groups</Link>
          </h2>
          <div className="grid gap-4">
            {sortedGroups.slice(0, 5).map((group) => (
              <div key={group.slug}>
                <Link href={routes.groups.show(group.slug)}>{group.title}</Link>
                <span className="text-muted ml-2">
                  {group.frontmatter.location}
                  {group.concertCount > 0 && (
                    <>
                      {" "}
                      • {group.concertCount} concert
                      {group.concertCount !== 1 ? "s" : ""}
                    </>
                  )}
                </span>
              </div>
            ))}
            {database.group.length > 5 && (
              <div className="mt-2">
                <Link
                  href={routes.groups.index()}
                  className="text-sm text-muted"
                >
                  View all {database.group.length} groups →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Conductors */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            <Link href={routes.conductors.index()}>Conductors</Link>
          </h2>
          <div className="grid gap-4">
            {sortedConductors.slice(0, 5).map((conductor) => (
              <div key={conductor.slug}>
                <Link href={routes.conductors.show(conductor.slug)}>
                  {conductor.title}
                </Link>
                {conductor.concertCount > 0 && (
                  <span className="text-muted ml-2">
                    ({conductor.concertCount} concert
                    {conductor.concertCount !== 1 ? "s" : ""})
                  </span>
                )}
              </div>
            ))}
            {database.conductor.length > 5 && (
              <div className="mt-2">
                <Link
                  href={routes.conductors.index()}
                  className="text-sm text-muted"
                >
                  View all {database.conductor.length} conductors →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Works */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            <Link href={routes.works.index()}>Works</Link>
          </h2>
          <div className="grid gap-4">
            {sortedWorks.slice(0, 5).map((work) => {
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
                      {work.concertCount > 0 && (
                        <>
                          {" "}
                          • {work.concertCount} concert
                          {work.concertCount !== 1 ? "s" : ""}
                        </>
                      )}
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
            {sortedComposers.slice(0, 5).map((composer) => (
              <div key={composer.slug}>
                <Link href={routes.composers.show(composer.slug)}>
                  {composer.title}
                </Link>
                <span className="text-muted ml-2">
                  ({composer.concertCount} concert
                  {composer.concertCount !== 1 ? "s" : ""})
                </span>
              </div>
            ))}
            {database.composer.length > 5 && (
              <div className="mt-2">
                <Link
                  href={routes.composers.index()}
                  className="text-sm text-muted"
                >
                  View all {database.composer.length} composers →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Venues */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            <Link href={routes.venues.index()}>Venues</Link>
          </h2>
          <div className="grid gap-4">
            {sortedVenues.slice(0, 5).map((venue) => {
              const location = locationMap[venue.slug];
              return (
                <div key={venue.slug}>
                  <Link href={routes.venues.show(venue.slug)}>
                    {venue.title}
                  </Link>
                  {(location || venue.concertCount > 0) && (
                    <span className="text-muted ml-2">
                      {location}
                      {location && venue.concertCount > 0 && " • "}
                      {venue.concertCount > 0 && (
                        <>
                          {venue.concertCount} concert
                          {venue.concertCount !== 1 ? "s" : ""}
                        </>
                      )}
                    </span>
                  )}
                </div>
              );
            })}
            {database.venue.length > 5 && (
              <div className="mt-2">
                <Link
                  href={routes.venues.index()}
                  className="text-sm text-muted"
                >
                  View all {database.venue.length} venues →
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
