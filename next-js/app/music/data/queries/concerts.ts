import database from "@music/data/database";
import {
  getDateFromFrontmatter,
  isUpcoming,
  isToday,
} from "@music/lib/helpers";

export function getConcerts() {
  return database.concert;
}

export function getConcertBySlug(slug: string) {
  return database.concert.find((concert) => concert.slug === slug);
}

export function getConcertsBySeason(seasonSlug: string) {
  return database.concert.filter(
    (concert) => concert.frontmatter.season === seasonSlug
  );
}

export function getConcertsByVenue(venueTitle: string) {
  return database.concert.filter(
    (concert) => concert.frontmatter.venue === venueTitle
  );
}

export function getConcertsByGroup(groupTitle: string) {
  return database.concert.filter(
    (concert) => concert.frontmatter.group === groupTitle
  );
}

export function getConcertsByConductor(conductorTitle: string) {
  return database.concert.filter((concert) => {
    const conductors = Array.isArray(concert.frontmatter.conductor)
      ? concert.frontmatter.conductor
      : [concert.frontmatter.conductor];
    return conductors.includes(conductorTitle);
  });
}

export function getConcertsByWork(workTitle: string) {
  return database.concert.filter((concert) => {
    const works = Array.isArray(concert.frontmatter.works)
      ? concert.frontmatter.works
      : concert.frontmatter.works
      ? [concert.frontmatter.works]
      : [];
    return works.includes(workTitle);
  });
}

export function getUpcomingConcerts() {
  return database.concert
    .filter((concert) => {
      const date = getDateFromFrontmatter(concert);
      return date ? isUpcoming(concert) || isToday(concert) : false;
    })
    .sort((a, b) => {
      const dateA = getDateFromFrontmatter(a);
      const dateB = getDateFromFrontmatter(b);
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime();
    });
}
