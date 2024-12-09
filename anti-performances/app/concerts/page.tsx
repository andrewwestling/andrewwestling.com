import Link from "next/link";
import database from "@/database";
import {
  getDateFromFilename,
  formatConcertTitle,
  formatDate,
  getDateForSorting,
  findConductorSlug,
} from "@/lib/helpers";

export default function ConcertsPage() {
  // Sort concerts by date
  const concerts = [...database.concert].sort((a, b) => {
    const dateA = getDateForSorting(a.frontmatter.date);
    const dateB = getDateForSorting(b.frontmatter.date);
    return dateB - dateA;
  });

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6">Concerts</h1>

      <div className="grid gap-6">
        {concerts.map((concert) => {
          const group = database.group.find(
            (g) => g.title === concert.frontmatter.group
          );

          const concertDate = getDateFromFilename(concert.slug);
          if (!concertDate) return null; // Skip concerts without valid dates

          const displayTitle = formatConcertTitle(concert.title, group);

          // Get conductor(s)
          const conductors = Array.isArray(concert.frontmatter.conductor)
            ? concert.frontmatter.conductor
            : concert.frontmatter.conductor
            ? [concert.frontmatter.conductor]
            : [];

          return (
            <article key={concert.slug} className="border-b pb-6">
              <Link href={`/concerts/${concertDate}`}>
                <h2 className="text-lg font-semibold mb-2">{displayTitle}</h2>
              </Link>

              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                <dt className="font-medium">Date</dt>
                <dd>{formatDate(concert.frontmatter.date)}</dd>

                <dt className="font-medium">Group</dt>
                <dd>
                  {group && (
                    <Link href={`/groups/${group.slug}`}>{group.title}</Link>
                  )}
                </dd>

                <dt className="font-medium">Location</dt>
                <dd>{group?.frontmatter.location}</dd>

                {conductors.length > 0 && (
                  <>
                    <dt className="font-medium">
                      Conductor{conductors.length > 1 ? "s" : ""}
                    </dt>
                    <dd>
                      {conductors.map((conductorName, i) => (
                        <span key={conductorName}>
                          {i > 0 && ", "}
                          <Link
                            href={`/conductors/${findConductorSlug(
                              conductorName
                            )}`}
                          >
                            {conductorName}
                          </Link>
                        </span>
                      ))}
                    </dd>
                  </>
                )}
              </dl>
            </article>
          );
        })}
      </div>
    </div>
  );
}
