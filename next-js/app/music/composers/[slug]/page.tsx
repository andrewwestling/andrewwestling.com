import { notFound } from "next/navigation";
import Link from "next/link";
import database from "@music/data/database";
import { getDateFromFilename, formatConcertTitle } from "@music/lib/helpers";
import { PageProps } from "@music/lib/types";
import { DidNotPlay } from "@music/components/DidNotPlay";
import { routes } from "@music/lib/routes";

export default function ComposerPage({ params }: PageProps) {
  const composer = database.composer.find(
    (c) => c.slug === decodeURIComponent(params.slug)
  );

  if (!composer) {
    notFound();
  }

  // Find all works by this composer
  const works = database.work.filter(
    (w) => w.frontmatter.composer === composer.title
  );

  // Find all concerts featuring works by this composer
  const concerts = database.concert.filter((c) => {
    const concertWorks = c.frontmatter.works
      ? Array.isArray(c.frontmatter.works)
        ? c.frontmatter.works
        : [c.frontmatter.works]
      : [];
    return works.some((work) => concertWorks.includes(work.title));
  });

  return (
    <article className="py-8">
      <h1 className="text-2xl font-bold mb-6">{composer.title}</h1>

      {works.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Works</h2>
          <div className="grid gap-4">
            {works.map((work) => (
              <div key={work.slug}>
                <Link href={routes.works.show(work.slug)}>{work.title}</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {concerts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Performances</h2>
          <div className="grid gap-4">
            {concerts.map((concert) => {
              const group = database.group.find(
                (g) => g.title === concert.frontmatter.group
              );
              const concertDate = getDateFromFilename(concert.slug);
              if (!concertDate) return null;

              const displayTitle = formatConcertTitle(concert.title, group);

              return (
                <div key={concert.slug} className="border-b pb-4">
                  <Link href={routes.concerts.show(concert.slug)}>
                    <h3 className="font-medium flex items-center gap-2">
                      {displayTitle}
                      {concert.frontmatter.didNotPlay && <DidNotPlay />}
                    </h3>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}
