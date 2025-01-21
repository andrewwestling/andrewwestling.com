import database from "@music/data/database";
import { routes } from "@music/lib/routes";
import { IndexPage } from "@music/components/IndexPage";
import { formatComposerName } from "@music/lib/helpers";

export default function ComposersPage() {
  const items = database.composer.map((composer) => {
    const works = database.work.filter(
      (w) => w.frontmatter.composer === composer.title
    );

    // Find all concerts that include any of this composer's works
    const concerts = database.concert.filter((concert) => {
      const concertWorks = concert.frontmatter.works
        ? Array.isArray(concert.frontmatter.works)
          ? concert.frontmatter.works
          : [concert.frontmatter.works]
        : [];
      return works.some((work) => concertWorks.includes(work.title));
    });

    return {
      slug: composer.slug,
      title: composer.title, // Not formatted, still show last name first like in the data
      href: routes.composers.show(composer.slug),
      stats: [
        `${works.length} work${works.length !== 1 ? "s" : ""}`,
        `${concerts.length} concert${concerts.length !== 1 ? "s" : ""}`,
      ],
      sortableFields: {
        title: composer.title, // Not the formatted name, the actual title, which has last name first
        concerts: concerts.length,
        works: works.length,
      },
    };
  });

  return <IndexPage title="Composers" items={items} />;
}
