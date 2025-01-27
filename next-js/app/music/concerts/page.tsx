import { Metadata } from "next";
import {
  formatConcertTitle,
  formatDate,
  getDateForSorting,
  isUpcoming,
} from "@music/lib/helpers";
import { getConcerts } from "@music/data/queries/concerts";
import { getGroupBySlug, getGroupByTitle } from "@music/data/queries/groups";
import { getSeasonBySlug, getCurrentSeason } from "@music/data/queries/seasons";
import { getConductorBySlug } from "@music/data/queries/conductors";
import { IndexPage } from "../components/IndexPage";
import { routes } from "../lib/routes";
import { Upcoming } from "../components/Upcoming";
import { ConcertListItem } from "../components/ConcertListItem";

export const metadata: Metadata = {
  title: "Concerts",
  description: "Concerts I've performed in",
};

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
      badges: [isUpcoming(concert.frontmatter.date) ? <Upcoming /> : null],
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
