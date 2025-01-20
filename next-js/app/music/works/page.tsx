import database from "@music/data/database";
import { routes } from "@music/lib/routes";
import { IndexPage } from "@music/components/IndexPage";
import { formatWorkTitle } from "../lib/helpers";

export default function WorksPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  let works = [...database.work];

  // Apply filters from searchParams
  if (searchParams.season) {
    const season = database.season.find((s) => s.slug === searchParams.season);
    if (season) {
      works = works.filter((work) => {
        // Find concerts in this season that include this work
        const concertsInSeason = database.concert.filter(
          (concert) =>
            concert.frontmatter.season === season.title &&
            (concert.frontmatter.works
              ? (Array.isArray(concert.frontmatter.works)
                  ? concert.frontmatter.works
                  : [concert.frontmatter.works]
                ).includes(work.title)
              : false)
        );

        // Keep the work if it was played in any concerts in this season
        return concertsInSeason.length > 0;
      });
    }
  }

  // Apply composer filter
  if (searchParams.composer) {
    const composer = database.composer.find(
      (c) => c.slug === searchParams.composer
    );
    if (composer) {
      works = works.filter(
        (work) => work.frontmatter.composer === composer.title
      );
    }
  }

  const items = works.map((work) => {
    // Find the composer
    const composer = database.composer.find(
      (c) => c.title === work.frontmatter.composer
    );

    // Find all concerts featuring this work
    const concerts = database.concert.filter((c) => {
      const works = c.frontmatter.works
        ? Array.isArray(c.frontmatter.works)
          ? c.frontmatter.works
          : [c.frontmatter.works]
        : [];
      return works.includes(work.title);
    });

    return {
      slug: work.slug,
      title: formatWorkTitle(work.title),
      href: routes.works.show(work.slug),
      stats: [
        composer && `by ${composer.title}`,
        `${concerts.length} concert${concerts.length !== 1 ? "s" : ""}`,
      ].filter(Boolean) as string[],
      sortableFields: {
        concerts: concerts.length,
        composer: composer?.title || "",
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
