import { Metadata } from "next";

import { IndexPage } from "@music/components/IndexPage";
import {
  getOrderedBucketList,
  getWorkByTitle,
  getComposerByTitle,
  getConcertsByWork,
} from "@music/data/queries";
import type { Work } from "@music/data/types";
import { formatWorkTitle, formatComposerName } from "@music/lib/helpers";
import { routes } from "@music/lib/routes";

export const metadata: Metadata = {
  title: "Bucket List",
  description: "Musical works I want to perform",
};

export default function BucketListPage() {
  // Get works in the order they appear in the bucket list
  const bucketListWorks = getOrderedBucketList()
    .map((title) => getWorkByTitle(title))
    .filter((work): work is Work => work !== undefined);

  const items = bucketListWorks.map((work, index) => {
    const composer = work.frontmatter.composer
      ? getComposerByTitle(work.frontmatter.composer)
      : undefined;

    const concerts = getConcertsByWork(work.title);
    const hasBeenPlayed = concerts.length > 0;

    const stats = [
      composer && `by ${formatComposerName(composer.title)}`,
      `${concerts.length} concert${concerts.length !== 1 ? "s" : ""}`,
    ].filter((stat): stat is string => stat !== undefined);

    return {
      slug: work.slug,
      title: formatWorkTitle(work),
      href: routes.works.show(work.slug),
      stats,
      sortableFields: {
        title: formatWorkTitle(work),
        composer: work.frontmatter.composer,
        desire: -index, // Original bucket list order
      },
      className: hasBeenPlayed ? "line-through text-muted" : "",
    };
  });

  return (
    <IndexPage
      title="Bucket List"
      items={items}
      defaultSort="desire"
      showFilters={false}
    />
  );
}
