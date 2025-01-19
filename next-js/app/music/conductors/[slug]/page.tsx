import { notFound } from "next/navigation";
import database from "@music/data/database";
import { PageProps } from "@music/lib/types";
import { ConcertListItem } from "@music/components/ConcertListItem";

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
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

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
