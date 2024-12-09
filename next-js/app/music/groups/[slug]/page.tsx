import { notFound } from "next/navigation";
import Link from "next/link";
import database from "@music/data/database";
import {
  getDateFromFilename,
  formatConcertTitle,
  isUpcoming,
} from "@music/lib/helpers";
import { PageProps } from "@music/lib/types";
import { ConcertBadges } from "@music/components/ConcertBadges";
import { routes } from "@music/lib/routes";

export default function GroupPage({ params }: PageProps) {
  const group = database.group.find((g) => g.slug === params.slug);

  if (!group) {
    notFound();
  }

  // Find all concerts for this group
  const concerts = database.concert.filter(
    (c) => c.frontmatter.group === group.title
  );

  return (
    <article className="py-8">
      <h1 className="text-2xl font-bold mb-4">{group.title}</h1>
      <p className="text-lg mb-6">{group.frontmatter.location}</p>

      {concerts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Concerts</h2>
          <div className="grid gap-4">
            {concerts.map((concert) => {
              const concertDate = getDateFromFilename(concert.slug);
              if (!concertDate) return null;

              const displayTitle = formatConcertTitle(concert.title, group);

              return (
                <div key={concert.slug} className="pb-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Link href={routes.concerts.show(concert.slug)}>
                      {displayTitle}
                    </Link>
                    <ConcertBadges concert={concert} />
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
