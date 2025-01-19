import { notFound } from "next/navigation";
import database from "@music/data/database";
import { PageProps } from "@music/lib/types";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { getDateForSorting } from "../../lib/helpers";

export default function ConductorPage({ params }: PageProps) {
  const conductor = database.conductor.find((c) => c.slug === params.slug);

  if (!conductor) {
    notFound();
  }

  // Find all concerts for this conductor
  const concerts = database.concert
    .filter((c) => {
      const conductors = Array.isArray(c.frontmatter.conductor)
        ? c.frontmatter.conductor
        : [c.frontmatter.conductor];
      return conductors.includes(conductor.title);
    })
    .sort((a, b) => {
      const dateA = getDateForSorting(a.frontmatter.date);
      const dateB = getDateForSorting(b.frontmatter.date);
      return dateB - dateA; // Sort descending (newest first)
    });

  return (
    <article>
      <h1 className="text-2xl font-bold mb-6">{conductor.title}</h1>

      {concerts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Concerts</h2>
          <div className="grid gap-4">
            {concerts.map((concert) => (
              <ConcertListItem key={concert.slug} concert={concert} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
