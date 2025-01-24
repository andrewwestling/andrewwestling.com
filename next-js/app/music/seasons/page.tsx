import { Metadata } from "next";
import { routes } from "@music/lib/routes";
import { IndexPage } from "@music/components/IndexPage";
import { getSeasons } from "@music/data/queries/seasons";
import { getConcertsBySeason } from "@music/data/queries/concerts";
import { getWorksBySeason } from "@music/data/queries/works";

export const metadata: Metadata = {
  title: "Seasons",
};

export default function SeasonsPage() {
  const seasons = getSeasons();

  const items = seasons.map((season) => {
    const concerts = getConcertsBySeason(season.slug);
    const works = getWorksBySeason(season.slug);

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
