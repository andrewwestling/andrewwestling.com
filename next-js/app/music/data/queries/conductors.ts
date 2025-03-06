import database from "@music/data/database";
import { Conductor } from "@music/data/types";

export function getConductors() {
  return database.conductor;
}

export function getConductorBySlug(slug: string) {
  return database.conductor.find((conductor) => conductor.slug === slug);
}

export function getConductorByTitle(title: string) {
  return database.conductor.find((conductor) => conductor.title === title);
}

export function getConductorsBySeason(seasonSlug: string) {
  const concerts = database.concert.filter(
    (concert) => concert.frontmatter.season === seasonSlug
  );

  const conductorSet = new Set<string>();
  concerts.forEach((concert) => {
    const conductors = Array.isArray(concert.frontmatter.conductor)
      ? concert.frontmatter.conductor
      : concert.frontmatter.conductor
      ? [concert.frontmatter.conductor]
      : [];
    conductors.forEach((conductor) => conductorSet.add(conductor));
  });

  return Array.from(conductorSet)
    .map((conductorTitle) =>
      database.conductor.find((c) => c.title === conductorTitle)
    )
    .filter((conductor): conductor is Conductor => conductor !== undefined);
}
