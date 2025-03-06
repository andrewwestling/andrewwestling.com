import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { PageProps } from "@music/data/types";
import { routes } from "@music/lib/routes";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { PageTitle } from "@music/components/PageTitle";
import { SectionHeading } from "@music/components/SectionHeading";
import { EmptyState } from "@components/EmptyState";
import {
  getDateForSorting,
  formatWorkTitle,
  formatComposerName,
} from "@music/lib/helpers";
import { BucketList } from "@music/components/BucketList";
import {
  getWorkBySlug,
  getComposerByTitle,
  getConcertsByWork,
} from "@music/data/queries";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const work = getWorkBySlug(decodeURIComponent(params.slug));
  if (!work) return { title: "Not Found" };

  return {
    title: work.title,
    description: `Performances of ${work.title}`,
  };
}

export default async function WorkPage(props: PageProps) {
  const params = await props.params;
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
          {work.bucketList && (
            <BucketList played={concerts.length > 0 ? true : false} />
          )}
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

      <div>
        <SectionHeading>Concerts</SectionHeading>
        {concerts.length > 0 ? (
          <div className="grid gap-4">
            {concerts.map((concert) => (
              <ConcertListItem key={concert.slug} concert={concert} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No concerts yet"
            description={
              work.bucketList ? (
                <span>
                  This work is on the{" "}
                  <Link href={routes.bucketList()}>Bucket List</Link>, but I
                  haven&apos;t performed it yet.
                </span>
              ) : (
                "I haven't performed this work yet."
              )
            }
          />
        )}
      </div>
    </article>
  );
}
