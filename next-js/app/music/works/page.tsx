import { Metadata } from "next";
import { routes } from "@music/lib/routes";
import { IndexPage } from "@music/components/IndexPage";
import { formatWorkTitle, formatComposerName } from "@music/lib/helpers";
import { getWorks } from "@music/data/queries/works";
import { getSeasonBySlug } from "@music/data/queries/seasons";
import { getComposerBySlug, getComposers } from "@music/data/queries/composers";
import { getConcertsByWork } from "@music/data/queries/concerts";
import { BucketList } from "@music/components/BucketList";

export const metadata: Metadata = {
  title: "Works",
  description: "Musical works I've performed",
};

export default async function WorksPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  let works = getWorks();

  // Apply filters from searchParams
  if (searchParams.season) {
    const season = getSeasonBySlug(searchParams.season);
    if (season) {
      works = works.filter((work) => {
        // Find concerts in this season that include this work
        const concertsInSeason = getConcertsByWork(work.title).filter(
          (concert) => concert.frontmatter.season === season.title
        );

        // Keep the work if it was played in any concerts in this season
        return concertsInSeason.length > 0;
      });
    }
  }

  // Apply composer filter
  if (searchParams.composer) {
    const composer = getComposerBySlug(searchParams.composer);
    if (composer) {
      works = works.filter(
        (work) => work.frontmatter.composer === composer.title
      );
    }
  }

  const items = works.map((work) => {
    const stats = [
      work.frontmatter.composer &&
        `by ${formatComposerName(work.frontmatter.composer)}`,
      `${work.concertCount} concert${work.concertCount !== 1 ? "s" : ""}`,
    ].filter((stat): stat is string => stat !== undefined);

    return {
      slug: work.slug,
      title: formatWorkTitle(work),
      href: routes.works.show(work.slug),
      stats,
      sortableFields: {
        title: formatWorkTitle(work),
        composer: work.frontmatter.composer,
        concerts: work.concertCount,
      },
      titleBadges: [
        work.bucketList ? <BucketList played={work.concertCount > 0} /> : null,
      ],
    };
  });

  // Pre-calculate work counts for each composer
  const allWorks = getWorks();
  const customCounts = {
    composer: Object.fromEntries(
      getComposers().map((composer) => [
        composer.title,
        allWorks.filter((work) => work.frontmatter.composer === composer.title)
          .length,
      ])
    ),
  };

  return (
    <div>
      <IndexPage
        title="Works"
        items={items}
        defaultSort="alphabetical"
        showFilters={true}
        facets={["composer"]}
        initialFilters={searchParams as Record<string, string>}
        customCounts={customCounts}
      />
    </div>
  );
}
