import database from "../database";
import { Group } from "@music/lib/types";

export function getGroups() {
  return database.group;
}

export function getGroupBySlug(slug: string) {
  return database.group.find((group) => group.slug === slug);
}

export function getGroupByTitle(title: string) {
  return database.group.find((group) => group.title === title);
}

export function getGroupsBySeason(seasonSlug: string) {
  const concerts = database.concert.filter(
    (concert) => concert.frontmatter.season === seasonSlug
  );

  const groupSet = new Set<string>();
  concerts.forEach((concert) => {
    if (concert.frontmatter.group) {
      groupSet.add(concert.frontmatter.group);
    }
  });

  return Array.from(groupSet)
    .map((groupTitle) => database.group.find((g) => g.title === groupTitle))
    .filter((group): group is Group => group !== undefined);
}
