import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageProps } from "@music/lib/types";
import { routes } from "@music/lib/routes";
import { formatWorkTitle, formatComposerName } from "../../lib/helpers";
import { ListItem } from "../../components/ListItem";
import { PageTitle } from "@music/components/PageTitle";
import { SectionHeading } from "@music/components/SectionHeading";
import { getComposerBySlug } from "@music/data/queries/composers";
import { getWorksByComposer } from "@music/data/queries/works";
import { BucketList } from "../../components/BucketList";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const composer = getComposerBySlug(decodeURIComponent(params.slug));
  if (!composer) return { title: "Not Found" };

  return {
    title: formatComposerName(composer.title),
    description: `Works I've performedby ${composer.title}`,
  };
}

export default function ComposerPage({ params }: PageProps) {
  const composer = getComposerBySlug(decodeURIComponent(params.slug));

  if (!composer) {
    notFound();
  }

  // Find all works by this composer
  const works = getWorksByComposer(composer.title);

  return (
    <article className="flex flex-col gap-6">
      <div>
        <PageTitle>{formatComposerName(composer.title)}</PageTitle>
      </div>
      {works.length > 0 && (
        <div className="mb-8">
          <SectionHeading>Works</SectionHeading>
          <div className="grid gap-4">
            {works.map((work) => (
              <ListItem
                key={work.slug}
                title={formatWorkTitle(work)}
                href={routes.works.show(work.slug)}
                stats={[]}
                badges={[
                  work.bucketList ? (
                    <BucketList played={work.concertCount > 0} />
                  ) : null,
                ]}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
