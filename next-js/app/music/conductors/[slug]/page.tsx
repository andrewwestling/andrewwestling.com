import { notFound } from "next/navigation";
import Link from "next/link";
import database from "@music/data/database";
import { getDateFromFilename, formatConcertTitle } from "@music/lib/helpers";
import { PageProps } from "@music/lib/types";
import { DidNotPlay } from "@music/components/DidNotPlay";
import { routes } from "@music/lib/routes";

export default function ConductorPage({ params }: PageProps) {
  const conductor = database.conductor.find((c) => c.slug === params.slug);

  if (!conductor) {
    notFound();
  }

  // Find all concerts for this conductor
  const concerts = database.concert.filter((c) => {
    const conductors = Array.isArray(c.frontmatter.conductor)
      ? c.frontmatter.conductor
      : [c.frontmatter.conductor];
    return conductors.includes(conductor.title);
  });

  return (
    <article className="py-8">
      <h1 className="text-2xl font-bold mb-6">{conductor.title}</h1>

      {concerts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Concerts</h2>
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
                  <h3 className="font-medium flex items-center gap-2">
                    <Link href={routes.concerts.show(concert.slug)}>
                      {displayTitle}
                    </Link>
                    {concert.frontmatter.didNotPlay && <DidNotPlay />}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}
