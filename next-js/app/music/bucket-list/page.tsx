import { routes } from "@music/lib/routes";
import { ListItem } from "@music/components/ListItem";
import { formatWorkTitle, formatComposerName } from "../lib/helpers";
import {
  getOrderedBucketList,
  getWorkByTitle,
} from "@music/data/queries/works";
import { getComposerByTitle } from "@music/data/queries/composers";
import { getConcertsByWork } from "@music/data/queries/concerts";
import { Work } from "../lib/types";

export default function BucketListPage() {
  // Get works in the order they appear in the bucket list
  const bucketListWorks = getOrderedBucketList()
    .map((title) => getWorkByTitle(title))
    .filter((work): work is Work => work !== undefined);

  return (
    <article className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Bucket List</h1>
      </div>

      <div className="grid gap-4">
        {bucketListWorks.map((work) => {
          // Find the composer
          const composer = work.frontmatter.composer
            ? getComposerByTitle(work.frontmatter.composer)
            : undefined;

          // Find all concerts featuring this work
          const concerts = getConcertsByWork(work.title);
          const hasBeenPlayed = concerts.length > 0;

          return (
            <ListItem
              key={work.slug}
              title={formatWorkTitle(work)}
              href={routes.works.show(work.slug)}
              stats={[
                composer && `by ${formatComposerName(composer.title)}`,
                `${concerts.length} concert${concerts.length !== 1 ? "s" : ""}`,
              ]}
              className={hasBeenPlayed ? "line-through text-muted" : ""}
            />
          );
        })}
      </div>
    </article>
  );
}
