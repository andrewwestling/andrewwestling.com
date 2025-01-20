import { notFound } from "next/navigation";
import Link from "next/link";
import database from "@music/data/database";
import { PageProps } from "@music/lib/types";
import { routes } from "@music/lib/routes";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { getDateForSorting, formatWorkTitle } from "../../lib/helpers";
import { BucketList } from "../../components/BucketList";

export default function WorkPage({ params }: PageProps) {
  const work = database.work.find(
    (w) => w.slug === decodeURIComponent(params.slug)
  );

  if (!work) {
    notFound();
  }

  // Find the composer
  const composer = database.composer.find(
    (c) => c.title === work.frontmatter.composer
  );

  // Find all concerts featuring this work
  const concerts = database.concert
    .filter((c) => {
      const works = c.frontmatter.works
        ? Array.isArray(c.frontmatter.works)
          ? c.frontmatter.works
          : [c.frontmatter.works]
        : [];
      return works.includes(work.title);
    })
    .sort((a, b) => {
      const dateA = getDateForSorting(a.frontmatter.date);
      const dateB = getDateForSorting(b.frontmatter.date);
      return dateB - dateA; // Sort descending (newest first)
    });

  return (
    <article>
      <h1 className="text-2xl font-bold mb-4 flex gap-2 items-center">
        {formatWorkTitle(work)}
        {work.bucketList && <BucketList />}
      </h1>

      {composer && (
        <p className="text-lg mb-6">
          by{" "}
          <Link href={routes.composers.show(composer.slug)}>
            {composer.title}
          </Link>
        </p>
      )}

      {concerts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Concerts</h2>
          <div className="grid gap-4">
            {concerts.map((concert) => (
              <ConcertListItem key={concert.slug} concert={concert} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
