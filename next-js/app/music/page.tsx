import Link from "next/link";
import database from "@music/data/database";
import {
  getDateFromFrontmatter,
  isUpcoming,
  getCurrentSeasonSlug,
} from "@music/lib/helpers";
import { routes } from "@music/lib/routes";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { Filters } from "@music/components/Filters";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // Get all concerts and sort them by date
  let allConcerts = [...database.concert].filter(
    (concert) => !concert.frontmatter.didNotPlay
  );

  // Apply filters if any are set
  if (Object.keys(searchParams).length > 0) {
    if (searchParams.group) {
      const group = database.group.find((g) => g.slug === searchParams.group);
      if (group) {
        allConcerts = allConcerts.filter(
          (concert) => concert.frontmatter.group === group.title
        );
      }
    }

    if (searchParams.season) {
      let seasonSlug = searchParams.season;
      // Handle "current" season in the URL
      if (seasonSlug === "current") {
        seasonSlug = getCurrentSeasonSlug(database.season) || seasonSlug;
      }

      const season = database.season.find((s) => s.slug === seasonSlug);
      if (season) {
        allConcerts = allConcerts.filter(
          (concert) => concert.frontmatter.season === season.title
        );
      }
    }

    if (searchParams.conductor) {
      const conductor = database.conductor.find(
        (c) => c.slug === searchParams.conductor
      );
      if (conductor) {
        allConcerts = allConcerts.filter((concert) => {
          const conductors = Array.isArray(concert.frontmatter.conductor)
            ? concert.frontmatter.conductor
            : [concert.frontmatter.conductor];
          return conductors.includes(conductor.title);
        });
      }
    }

    if (searchParams.venue) {
      const venue = database.venue.find((v) => v.slug === searchParams.venue);
      if (venue) {
        allConcerts = allConcerts.filter(
          (concert) => concert.frontmatter.venue === venue.title
        );
      }
    }

    // Return filtered results
    return (
      <div className="grid gap-12">
        <section>
          <Filters initialFilters={searchParams as Record<string, string>} />
        </section>
        <section>
          <div className="grid gap-6">
            {allConcerts.map((concert) => (
              <ConcertListItem
                key={concert.slug}
                concert={concert}
                expanded={true}
              />
            ))}
          </div>
        </section>
      </div>
    );
  }

  // If no filters, show the default home page layout
  const upcomingConcerts = allConcerts
    .filter((concert) => isUpcoming(concert.frontmatter.date))
    .sort((a, b) => {
      const dateA = getDateFromFrontmatter(a);
      const dateB = getDateFromFrontmatter(b);
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime(); // Ascending for upcoming
    });

  // Get current season
  const currentSeasonSlug = getCurrentSeasonSlug(database.season);
  const currentSeason = currentSeasonSlug
    ? database.season.find((s) => s.slug === currentSeasonSlug)
    : null;

  // Get current season concerts
  const currentSeasonConcerts = currentSeason
    ? currentSeason.concertSlugs
        .map((slug) => database.concert.find((c) => c.slug === slug))
        .filter(Boolean)
    : [];

  return (
    <div className="grid gap-12">
      {/* Filters */}
      <section>
        <Filters />
      </section>

      {/* Up Next */}
      {upcomingConcerts.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Up Next</h2>
          <div className="grid gap-4">
            {upcomingConcerts.slice(0, 2).map((concert) => (
              <ConcertListItem key={concert.slug} concert={concert} />
            ))}
          </div>
        </section>
      )}

      {/* This Season */}
      {currentSeason && (
        <section>
          <h2 className="text-xl font-semibold mb-4">This Season</h2>
          {currentSeasonConcerts.length > 0 && (
            <div className="grid gap-4">
              {currentSeasonConcerts.map(
                (concert) =>
                  concert && (
                    <ConcertListItem key={concert.slug} concert={concert} />
                  )
              )}
            </div>
          )}
        </section>
      )}

      {/* Quick Links */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid gap-2">
          <Link
            href={routes.concerts.index()}
            className="text-muted hover:text-text"
          >
            All Concerts →
          </Link>
          <Link
            href={routes.works.index()}
            className="text-muted hover:text-text"
          >
            All Works →
          </Link>
        </div>
      </section>
    </div>
  );
}
