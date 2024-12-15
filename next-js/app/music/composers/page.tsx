import Link from "next/link";
import database from "@music/data/database";
import { routes } from "@music/lib/routes";

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
            <div key={composer.slug}>
              <Link href={routes.composers.show(composer.slug)}>
                {composer.title}
              </Link>
              <span className="text-muted ml-2">
                ({works.length} work{works.length !== 1 ? "s" : ""})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
