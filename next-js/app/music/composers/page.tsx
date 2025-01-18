import database from "@music/data/database";
import { routes } from "@music/lib/routes";
import { IndexPage } from "@music/components/IndexPage";

export default function ComposersPage() {
  const items = database.composer.map((composer) => {
    const works = database.work.filter(
      (w) => w.frontmatter.composer === composer.title
    );
    return {
      slug: composer.slug,
      title: composer.title,
      href: routes.composers.show(composer.slug),
      stats: [`${works.length} work${works.length !== 1 ? "s" : ""}`],
    };
  });

  return <IndexPage title="Composers" items={items} />;
}
