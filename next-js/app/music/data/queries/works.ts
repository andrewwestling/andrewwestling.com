import database from "../database";
import { Work } from "@music/lib/types";

export function getWorks() {
  return database.work;
}

export function getWorksByComposer(composerTitle: string) {
  return database.work.filter(
    (work) => work.frontmatter.composer === composerTitle
  );
}

export function getWorksBySeason(seasonSlug: string) {
  const season = database.season.find((s) => s.slug === seasonSlug);
  if (!season) return [];
  return season.workSlugs
    .map((slug) => database.work.find((w) => w.slug === slug))
    .filter((work): work is Work => work !== undefined);
}

export function getWorksByBucketList(inBucketList: boolean = true) {
  return database.work.filter((work) => work.bucketList === inBucketList);
}

export function getWorkBySlug(slug: string) {
  return database.work.find((work) => work.slug === slug);
}

export function getWorkByTitle(title: string) {
  return database.work.find((work) => work.title === title);
}

export function getOrderedBucketList() {
  return database.orderedBucketList;
}
