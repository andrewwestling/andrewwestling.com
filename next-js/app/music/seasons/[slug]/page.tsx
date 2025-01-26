import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageProps } from "@music/lib/types";
import { routes } from "@music/lib/routes";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { formatComposerName, formatWorkTitle } from "../../lib/helpers";
import { ListItem } from "../../components/ListItem";
import { PageTitle } from "@music/components/PageTitle";
import { SectionHeading } from "@music/components/SectionHeading";
import { getSeasonBySlug } from "@music/data/queries/seasons";
import { getConcertsBySeason } from "@music/data/queries/concerts";
import { getWorksBySeason } from "@music/data/queries/works";
import { BucketList } from "../../components/BucketList";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const season = getSeasonBySlug(decodeURIComponent(params.slug));
  if (!season) return { title: "Not Found" };

  return {
    title: season.title,
    description: `Concerts I performed in ${season.title}`,
  };
}

export default function SeasonPage({ params }: PageProps) {
  const season = getSeasonBySlug(params.slug);

  if (!season) {
    notFound();
  }

  // Find concerts for this season
  const concerts = getConcertsBySeason(season.slug);

  // Find works for this season
  const works = getWorksBySeason(season.slug);

  return (
    <article className="flex flex-col gap-6">
      <div>
        <PageTitle>{season.title}</PageTitle>
      </div>

      {concerts.length > 0 && (
        <section>
          <SectionHeading>Concerts</SectionHeading>
          <div className="grid gap-4">
            {concerts.map((concert) => (
              <ConcertListItem key={concert.slug} concert={concert} />
            ))}
          </div>
        </section>
      )}

      {works.length > 0 && (
        <section>
          <SectionHeading>Works</SectionHeading>
          <div className="grid gap-4">
            {works.map((work) => (
              <ListItem
                key={work.slug}
                title={formatWorkTitle(work)}
                href={routes.works.show(work.slug)}
                stats={[
                  work.frontmatter.composer &&
                    formatComposerName(work.frontmatter.composer),
                ].filter(Boolean)}
                bucketList={
                  work.bucketList ? (
                    <BucketList played={work.concertCount > 0} />
                  ) : null
                }
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
