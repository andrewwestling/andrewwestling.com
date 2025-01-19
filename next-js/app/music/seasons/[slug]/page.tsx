import { notFound } from "next/navigation";
import Link from "next/link";
import database from "@music/data/database";
import { PageProps } from "@music/lib/types";
import { routes } from "@music/lib/routes";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { formatWorkTitle } from "../../lib/helpers";

export default function SeasonPage({ params }: PageProps) {
  const season = database.season.find((s) => s.slug === params.slug);

  if (!season) {
    notFound();
  }

  // Find concerts for this season
  const concerts = season.concertSlugs
    .map((concertSlug) => database.concert.find((c) => c.slug === concertSlug))
    .filter(Boolean);

  // Find works for this season
  const works = season.workSlugs
    .map((workSlug) => database.work.find((w) => w.slug === workSlug))
    .filter(Boolean);

  return (
    <article>
      <h1 className="text-2xl font-bold">{season.title}</h1>

      {concerts.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Concerts</h2>
          <div className="grid gap-4">
            {concerts.map(
              (concert) =>
                concert && (
                  <ConcertListItem key={concert.slug} concert={concert} />
                )
            )}
          </div>
        </section>
      )}

      {works.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Works</h2>
          <div className="grid gap-4">
            {works.map(
              (work) =>
                work && (
                  <div key={work.slug}>
                    <Link
                      href={routes.works.show(work.slug)}
                      className="font-medium"
                    >
                      {formatWorkTitle(work.title)}
                    </Link>
                    {work.frontmatter.composer && (
                      <span className="text-muted ml-2">
                        by {work.frontmatter.composer}
                      </span>
                    )}
                  </div>
                )
            )}
          </div>
        </section>
      )}
    </article>
  );
}
