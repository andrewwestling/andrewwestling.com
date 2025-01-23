import { getDateForSorting } from "@music/lib/helpers";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { Filters } from "@music/components/Filters";
import { getConcerts } from "@music/data/queries/concerts";
import { getGroupBySlug } from "@music/data/queries/groups";
import { getSeasonBySlug, getCurrentSeason } from "@music/data/queries/seasons";
import { getConductorBySlug } from "@music/data/queries/conductors";
import { PageTitle } from "@music/components/PageTitle";

export default async function ConcertsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  let concerts = [...getConcerts()];

  // Apply filters from searchParams
  if (searchParams.group) {
    const group = getGroupBySlug(searchParams.group);
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
      const currentSeason = getCurrentSeason();
      if (currentSeason) {
        seasonSlug = currentSeason.slug;
      }
    }

    const season = getSeasonBySlug(seasonSlug);
    if (season) {
      concerts = concerts.filter(
        (concert) => concert.frontmatter.season === season.title
      );
    }
  }

  if (searchParams.conductor) {
    const conductor = getConductorBySlug(searchParams.conductor);
    if (conductor) {
      concerts = concerts.filter((concert) => {
        const conductors = Array.isArray(concert.frontmatter.conductor)
          ? concert.frontmatter.conductor
          : concert.frontmatter.conductor
          ? [concert.frontmatter.conductor]
          : [];
        return conductors.includes(conductor.title);
      });
    }
  }

  // Sort concerts by date
  concerts.sort((a, b) => {
    const dateA = new Date(getDateForSorting(a.frontmatter.date));
    const dateB = new Date(getDateForSorting(b.frontmatter.date));
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <PageTitle>Concerts</PageTitle>
      </div>

      <Filters />

      <div className="grid gap-4">
        {concerts.map((concert) => (
          <ConcertListItem key={concert.slug} concert={concert} />
        ))}
      </div>
    </div>
  );
}
