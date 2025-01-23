import { notFound } from "next/navigation";
import Link from "next/link";
import { PageProps } from "@music/lib/types";
import { routes } from "@music/lib/routes";
import { ConcertListItem } from "@music/components/ConcertListItem";
import {
  getDateForSorting,
  formatWorkTitle,
  formatComposerName,
} from "../../lib/helpers";
import { BucketList } from "../../components/BucketList";
import { getWorkBySlug } from "@music/data/queries/works";
import { getComposerByTitle } from "@music/data/queries/composers";
import { getConcertsByWork } from "@music/data/queries/concerts";

export default function WorkPage({ params }: PageProps) {
  const work = getWorkBySlug(decodeURIComponent(params.slug));

  if (!work) {
    notFound();
  }

  // Find the composer
  const composer = work.frontmatter.composer
    ? getComposerByTitle(work.frontmatter.composer)
    : undefined;

  // Find all concerts featuring this work
  const concerts = getConcertsByWork(work.title).sort((a, b) => {
    const dateA = new Date(getDateForSorting(a.frontmatter.date));
    const dateB = new Date(getDateForSorting(b.frontmatter.date));
    return dateB.getTime() - dateA.getTime(); // Sort descending (newest first)
  });

  return (
    <article className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold flex gap-2 items-center">
          {formatWorkTitle(work)}
          {work.bucketList && <BucketList />}
        </h1>

        {composer && (
          <p>
            by{" "}
            <Link href={routes.composers.show(composer.slug)}>
              {formatComposerName(composer.title)}
            </Link>
          </p>
        )}
      </div>

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
