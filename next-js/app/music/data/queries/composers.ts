import database from "@music/data/database";
import { Composer } from "@music/data/types";

export function getComposers() {
  return database.composer;
}

export function getComposerBySlug(slug: string) {
  return database.composer.find((composer) => composer.slug === slug);
}

export function getComposerByTitle(title: string) {
  return database.composer.find((composer) => composer.title === title);
}

export function getComposersBySeason(seasonSlug: string) {
  const season = database.season.find((s) => s.slug === seasonSlug);
  if (!season) return [];

  const composerSet = new Set<string>();
  season.workSlugs.forEach((workSlug) => {
    const work = database.work.find((w) => w.slug === workSlug);
    if (work?.frontmatter.composer) {
      composerSet.add(work.frontmatter.composer);
    }
  });

  return Array.from(composerSet)
    .map((composerTitle) =>
      database.composer.find((c) => c.title === composerTitle)
    )
    .filter((composer): composer is Composer => composer !== undefined);
}
