import database from "@music/data/database";
import { Season } from "@music/data/types";
import { getCurrentSeasonYear } from "@music/lib/helpers";

export function getSeasons() {
  return database.season;
}

export function getSeasonBySlug(slug: string) {
  return database.season.find((season) => season.slug === slug);
}

export function getCurrentSeason() {
  const currentYear = getCurrentSeasonYear();
  return database.season.find(
    (season) => season.frontmatter.year === currentYear
  );
}

export function getSeasonByYear(year: number) {
  return database.season.find((season) => season.frontmatter.year === year);
}

export function getSeasonsByWork(workTitle: string) {
  return database.season.filter((season) => {
    const work = database.work.find((w) => w.title === workTitle);
    if (!work) return false;
    return season.workSlugs.includes(work.slug);
  });
}

export function getSeasonsByGroup(groupTitle: string) {
  const concerts = database.concert.filter(
    (concert) => concert.frontmatter.group === groupTitle
  );

  const seasonSet = new Set<string>();
  concerts.forEach((concert) => {
    if (concert.frontmatter.season) {
      seasonSet.add(concert.frontmatter.season);
    }
  });

  return Array.from(seasonSet)
    .map((seasonSlug) => database.season.find((s) => s.slug === seasonSlug))
    .filter((season): season is Season => season !== undefined);
}
