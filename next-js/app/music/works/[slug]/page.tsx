import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageProps } from "@music/lib/types";
import { routes } from "@music/lib/routes";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { PageTitle } from "@music/components/PageTitle";
import { SectionHeading } from "@music/components/SectionHeading";
import {
  getDateForSorting,
  formatWorkTitle,
  formatComposerName,
} from "../../lib/helpers";
import { BucketList } from "../../components/BucketList";
import { getWorkBySlug } from "@music/data/queries/works";
import { getComposerByTitle } from "@music/data/queries/composers";
import { getConcertsByWork } from "@music/data/queries/concerts";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const work = getWorkBySlug(decodeURIComponent(params.slug));
  if (!work) return { title: "Not Found" };

  return {
    title: work.title,
    description: `Performances of ${work.title}`,
  };
}

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
        <PageTitle className="flex gap-2 items-center">
          {formatWorkTitle(work)}
          {work.bucketList && <BucketList />}
        </PageTitle>

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
          <SectionHeading>Concerts</SectionHeading>
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
