import { Metadata } from "next";
import { notFound } from "next/navigation";

import { EmptyState } from "@components/EmptyState";
import { BackForwardNavigation } from "@music/components/BackForwardNavigation";
import { BucketList } from "@music/components/BucketList";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { ListItem } from "@music/components/ListItem";
import { PageTitle } from "@music/components/PageTitle";
import { SectionHeading } from "@music/components/SectionHeading";
import {
  getSeasonBySlug,
  getConcertsBySeason,
  getWorksBySeason,
} from "@music/data/queries";
import type { PageProps } from "@music/data/types";
import {
  formatComposerName,
  formatWorkTitle,
  getNextSeason,
  getPreviousSeason,
} from "@music/lib/helpers";
import { routes } from "@music/lib/routes";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const season = getSeasonBySlug(decodeURIComponent(params.slug));
  if (!season) return { title: "Not Found" };

  return {
    title: season.title,
    description: `Concerts I performed in ${season.title}`,
  };
}

export default async function SeasonPage(props: PageProps) {
  const params = await props.params;
  const season = getSeasonBySlug(params.slug);

  if (!season) {
    notFound();
  }

  // Find concerts for this season
  const concerts = getConcertsBySeason(season.slug);

  // Find works for this season
  const works = getWorksBySeason(season.slug);

  // Get next/prev seasons
  const prevSeason = getPreviousSeason(season.slug);
  const nextSeason = getNextSeason(season.slug);

  return (
    <article className="flex flex-col gap-6">
      <div className="flex flex-row items-start justify-between gap-4">
        <PageTitle>{season.title}</PageTitle>
        <div className="hidden sm:block">
          <BackForwardNavigation
            prev={prevSeason}
            next={nextSeason}
            getHref={(season) => routes.seasons.show(season.slug)}
            getTooltip={(season) => season.title}
          />
        </div>
      </div>

      <section>
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
            description={`I haven't performed any concerts in ${season.title} yet.`}
          />
        )}
      </section>

      <section>
        <SectionHeading>Works</SectionHeading>
        {works.length > 0 ? (
          <div className="grid gap-4">
            {works.map((work) => (
              <ListItem
                key={work.slug}
                title={formatWorkTitle(work)}
                href={routes.works.show(work.slug)}
                stats={[
                  work.frontmatter.composer &&
                    `by ${formatComposerName(work.frontmatter.composer)}`,
                ].filter(Boolean)}
                titleBadges={[
                  work.bucketList ? (
                    <BucketList played={work.concertCount > 0} />
                  ) : null,
                ]}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No works yet"
            description={`I haven't performed any works in ${season.title} yet.`}
          />
        )}
      </section>
    </article>
  );
}
