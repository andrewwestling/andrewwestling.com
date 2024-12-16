import database from "@music/data/database";
import { routes } from "@music/lib/routes";
import { ListItem } from "@music/components/ListItem";

export default function ComposersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Composers</h1>

      <div className="grid gap-4">
        {database.composer.map((composer) => {
          const works = database.work.filter(
            (w) => w.frontmatter.composer === composer.title
          );
          return (
            <ListItem
              key={composer.slug}
              title={composer.title}
              href={routes.composers.show(composer.slug)}
              stats={[`${works.length} work${works.length !== 1 ? "s" : ""}`]}
            />
          );
        })}
      </div>
    </div>
  );
}
