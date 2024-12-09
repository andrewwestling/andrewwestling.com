import { notFound } from "next/navigation";
import Link from "next/link";
import database from "@/database";
import { getDateFromFilename, formatConcertTitle } from "@/lib/helpers";
import { PageProps } from "@/lib/types";

export default function WorkPage({ params }: PageProps) {
  const work = database.work.find(
    (w) => w.slug === decodeURIComponent(params.slug)
  );

  if (!work) {
    notFound();
  }

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
    <article className="py-8">
      <h1 className="text-2xl font-bold mb-4">{work.title}</h1>

      {composer && (
        <p className="text-lg mb-6">
          by <Link href={`/composers/${composer.slug}`}>{composer.title}</Link>
        </p>
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
                  <Link href={`/concerts/${concertDate}`}>
                    <h3 className="font-medium">{displayTitle}</h3>
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
