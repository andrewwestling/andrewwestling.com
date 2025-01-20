import database from "@music/data/database";
import { getDateForSorting } from "@music/lib/helpers";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { Filters } from "@music/components/Filters";

export default async function ConcertsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  let concerts = [...database.concert];

  // Apply filters from searchParams
  if (searchParams.group) {
    const group = database.group.find((g) => g.slug === searchParams.group);
    if (group) {
      concerts = concerts.filter(
        (concert) => concert.frontmatter.group === group.title
      );
    }
  }

  if (searchParams.season) {
    let seasonSlug = searchParams.season;
    // Handle "current" season in the URL
    if (seasonSlug === "current") {
      const currentYear = new Date().getFullYear();
      const month = new Date().getMonth();
      const year = month < 8 ? currentYear - 1 : currentYear;
      const expectedSeasonTitle = `${year}-${year + 1}`;
      const currentSeason = database.season.find(
        (s) => s.title === expectedSeasonTitle
      );
      if (currentSeason) {
        seasonSlug = currentSeason.slug;
      }
    }

    const season = database.season.find((s) => s.slug === seasonSlug);
    if (season) {
      concerts = concerts.filter(
        (concert) => concert.frontmatter.season === season.title
      );
    }
  }

  if (searchParams.conductor) {
    const conductor = database.conductor.find(
      (c) => c.slug === searchParams.conductor
    );
    if (conductor) {
      concerts = concerts.filter((concert) => {
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
      concerts = concerts.filter(
        (concert) => concert.frontmatter.venue === venue.title
      );
    }
  }

  // Add composer filtering
  if (searchParams.composer) {
    const composer = database.composer.find(
      (c) => c.slug === searchParams.composer
    );
    if (composer) {
      concerts = concerts.filter((concert) => {
        const works = concert.frontmatter.works
          ? Array.isArray(concert.frontmatter.works)
            ? concert.frontmatter.works
            : [concert.frontmatter.works]
          : [];

        // Find works by this composer in the concert
        const composerWorks = database.work.filter(
          (work) => work.frontmatter.composer === composer.title
        );

        // Check if any of the composer's works are in this concert
        return composerWorks.some((work) => works.includes(work.title));
      });
    }
  }

  // Sort concerts by date
  concerts.sort((a, b) => {
    const dateA = getDateForSorting(a.frontmatter.date);
    const dateB = getDateForSorting(b.frontmatter.date);
    return dateB - dateA;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Concerts</h1>

      <Filters initialFilters={searchParams as Record<string, string>} />

      <div className="grid gap-6">
        {concerts.map((concert) => (
          <ConcertListItem key={concert.slug} concert={concert} />
        ))}
      </div>
    </div>
  );
}
