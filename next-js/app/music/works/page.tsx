import database from "@music/data/database";
import { routes } from "@music/lib/routes";
import { ListItem } from "@music/components/ListItem";

export default function WorksPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Works</h1>

      <div className="grid gap-4">
        {database.work.map((work) => {
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

          return (
            <ListItem
              key={work.slug}
              title={work.title}
              href={routes.works.show(work.slug)}
              stats={[
                composer && `by ${composer.title}`,
                `${concerts.length} concert${concerts.length !== 1 ? "s" : ""}`,
              ]}
            />
          );
        })}
      </div>
    </div>
  );
}
