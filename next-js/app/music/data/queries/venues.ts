import database from "@music/data/database";
import type { Venue } from "@music/data/types";

export function getVenues() {
  return database.venue;
}

export function getVenueBySlug(slug: string) {
  return database.venue.find((venue) => venue.slug === slug);
}

export function getVenueByTitle(title: string) {
  return database.venue.find((venue) => venue.title === title);
}

export function getVenuesBySeason(seasonSlug: string) {
  const concerts = database.concert.filter(
    (concert) => concert.frontmatter.season === seasonSlug
  );

  const venueSet = new Set<string>();
  concerts.forEach((concert) => {
    if (concert.frontmatter.venue) {
      venueSet.add(concert.frontmatter.venue);
    }
  });

  return Array.from(venueSet)
    .map((venueTitle) => database.venue.find((v) => v.title === venueTitle))
    .filter((venue): venue is Venue => venue !== undefined);
}

export function getVenuesByGroup(groupTitle: string) {
  const concerts = database.concert.filter(
    (concert) => concert.frontmatter.group === groupTitle
  );

  const venueSet = new Set<string>();
  concerts.forEach((concert) => {
    if (concert.frontmatter.venue) {
      venueSet.add(concert.frontmatter.venue);
    }
  });

  return Array.from(venueSet)
    .map((venueTitle) => database.venue.find((v) => v.title === venueTitle))
    .filter((venue): venue is Venue => venue !== undefined);
}
