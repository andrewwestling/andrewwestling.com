import database from "@music/data/database";
import { routes } from "@music/lib/routes";
import { ListItem } from "@music/components/ListItem";
import { formatWorkTitle } from "../lib/helpers";

export default function BucketListPage() {
  // Find bucket list works
  const bucketListWorks = database.work.filter((work) => work.bucketList);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bucket List</h1>

      <div className="grid gap-4">
        {bucketListWorks.map((work) => {
          // Find the composer
          const composer = database.composer.find(
            (c) => c.title === work.frontmatter.composer
          );

          // Find all concerts featuring this work
          const concerts = database.concert.filter((c) => {
            const works = c.frontmatter.works
              ? Array.isArray(c.frontmatter.works)
                ? c.frontmatter.works
                : [c.frontmatter.works]
              : [];
            return works.includes(work.title);
          });

          // Determine if the work has been played
          const hasBeenPlayed = concerts.length > 0;

          return (
            <ListItem
              key={work.slug}
              title={formatWorkTitle(work)}
              href={routes.works.show(work.slug)}
              stats={[
                composer && `by ${composer.title}`,
                `${concerts.length} concert${concerts.length !== 1 ? "s" : ""}`,
              ]}
              className={hasBeenPlayed ? "line-through text-muted" : ""}
            />
          );
        })}
      </div>
    </div>
  );
}
