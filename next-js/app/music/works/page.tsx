import { routes } from "@music/lib/routes";
import { IndexPage } from "@music/components/IndexPage";
import { formatWorkTitle, formatComposerName } from "../lib/helpers";
import { getWorks } from "@music/data/queries/works";
import { getSeasonBySlug } from "@music/data/queries/seasons";
import { getComposerBySlug } from "@music/data/queries/composers";
import { getConcertsByWork } from "@music/data/queries/concerts";

export default function WorksPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
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
        title: work.title,
        concerts: work.concertCount,
      },
      bucketList: work.bucketList,
    };
  });

  return (
    <div>
      <IndexPage
        title="Works"
        items={items}
        defaultSort="concerts"
        showFilters={true}
        facets={["composer"]}
        initialFilters={searchParams as Record<string, string>}
      />
    </div>
  );
}
