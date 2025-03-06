import { Metadata } from "next";

import { IndexPage } from "@music/components/IndexPage";
import {
  getComposers,
  getWorksByComposer,
  getConcertsByWork,
} from "@music/data/queries";
import { routes } from "@music/lib/routes";

export const metadata: Metadata = {
  title: "Composers",
  description: "Composers whose works I've performed",
};

export default function ComposersPage() {
  const composers = getComposers();

  const items = composers.map((composer) => {
    // Get all works by this composer
    const works = getWorksByComposer(composer.title);

    // Get all concerts for each work and deduplicate
    const concertSet = new Set<string>();
    works.forEach((work) => {
      getConcertsByWork(work.title).forEach((concert) => {
        concertSet.add(concert.slug);
      });
    });

    return {
      slug: composer.slug,
      title: composer.title, // Not formatted, still show last name first like in the data
      href: routes.composers.show(composer.slug),
      stats: [
        `${works.length} work${works.length !== 1 ? "s" : ""}`,
        `${concertSet.size} concert${concertSet.size !== 1 ? "s" : ""}`,
      ],
      sortableFields: {
        title: composer.title, // Not the formatted name, the actual title, which has last name first
        concerts: concertSet.size,
        works: works.length,
      },
    };
  });

  return <IndexPage title="Composers" items={items} />;
}
