import { notFound } from "next/navigation";
import Link from "next/link";
import database from "@music/data/database";
import { PageProps } from "@music/lib/types";
import { routes } from "@music/lib/routes";
import { formatWorkTitle } from "../../lib/helpers";
import { BucketList } from "../../components/BucketList";
import { ListItem } from "../../components/ListItem";

export default function ComposerPage({ params }: PageProps) {
  const composer = database.composer.find(
    (c) => c.slug === decodeURIComponent(params.slug)
  );

  if (!composer) {
    notFound();
  }

  // Find all works by this composer
  const works = database.work.filter(
    (w) => w.frontmatter.composer === composer.title
  );

  return (
    <article>
      <h1 className="text-2xl font-bold mb-6">{composer.title}</h1>

      {works.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Works</h2>
          <div className="grid gap-4">
            {works.map((work) => (
              <ListItem
                key={work.slug}
                title={formatWorkTitle(work)}
                href={routes.works.show(work.slug)}
                stats={[]}
                bucketList={work.bucketList}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
