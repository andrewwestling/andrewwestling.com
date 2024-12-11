import database from "@music/data/database";
import { getDateForSorting } from "@music/lib/helpers";
import { ConcertListItem } from "@music/components/ConcertListItem";

export default async function ConcertsPage() {
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
        {concerts.map((concert) => (
          <ConcertListItem
            key={concert.slug}
            concert={concert}
            expanded={true}
          />
        ))}
      </div>
    </div>
  );
}
