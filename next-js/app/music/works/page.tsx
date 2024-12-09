import Link from "next/link";
import database from "@music/data/database";
import { routes } from "@music/lib/routes";

export default function WorksPage() {
  return (
    <div className="py-8">
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
            <div key={work.slug}>
              <Link href={routes.works.show(work.slug)}>{work.title}</Link>
              {composer && (
                <span className="text-muted ml-2">
                  by{" "}
                  <Link href={routes.composers.show(composer.slug)}>
                    {composer.title}
                  </Link>
                  {concerts.length > 0 && (
                    <>
                      {" "}
                      • {concerts.length} performance
                      {concerts.length !== 1 ? "s" : ""}
                    </>
                  )}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
