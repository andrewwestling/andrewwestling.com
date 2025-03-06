import { Metadata } from "next";
import {
  formatConcertTitle,
  formatDate,
  getDateForSorting,
} from "@music/lib/helpers";
import {
  getConcerts,
  getGroupBySlug,
  getGroupByTitle,
  getSeasonBySlug,
  getCurrentSeason,
  getConductorBySlug,
} from "@music/data/queries";
import { IndexPage } from "@music/components/IndexPage";
import { routes } from "@music/lib/routes";
import { ConcertBadges } from "@music/components/ConcertBadges";

export const metadata: Metadata = {
  title: "Concerts",
  description: "Concerts I've performed in",
};

export default async function ConcertsPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
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

  const items = concerts.map((concert) => {
    const stats = [formatDate(concert.frontmatter.date)].filter(
      (stat): stat is string => stat !== undefined
    );

    return {
      slug: concert.slug,
      title: formatConcertTitle(
        concert.title,
        getGroupByTitle(concert.frontmatter.group)
      ),
      href: routes.concerts.show(concert.slug),
      stats,
      sortableFields: {
        alphabetical: false,
        date: concert.frontmatter.date,
      },
      statsBadges: [<ConcertBadges key={concert.slug} concert={concert} />],
    };
  });

  // Sort by date, most recent first
  items.sort((a, b) => {
    const dateA = new Date(getDateForSorting(a.sortableFields.date));
    const dateB = new Date(getDateForSorting(b.sortableFields.date));
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <IndexPage
      title="Concerts"
      items={items}
      defaultSort="date"
      showFilters={true}
      facets={["group", "season", "conductor"]}
      initialFilters={searchParams as Record<string, string>}
    />
  );
}
