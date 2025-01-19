import database from "@music/data/database";
import { routes } from "@music/lib/routes";
import { IndexPage } from "@music/components/IndexPage";

export default function SeasonsPage() {
  const items = database.season.map((season) => {
    const concerts = season.concertSlugs.map((concertSlug: string) =>
      database.concert.find((c) => c.slug === concertSlug)
    );

    const works = season.workSlugs.map((workSlug: string) =>
      database.work.find((w) => w.slug === workSlug)
    );

    return {
      slug: season.slug,
      title: season.title,
      href: routes.seasons.show(season.slug),
      stats: [
        `${concerts.length} concert${concerts.length !== 1 ? "s" : ""}`,
        `${works.length} work${works.length !== 1 ? "s" : ""}`,
      ],
      sortableFields: {
        concerts: concerts.length,
        works: works.length,
        year: parseInt(season.title.split("-")[1] || season.title),
      },
    };
  });

  return <IndexPage title="Seasons" items={items} defaultSort="year" />;
}
