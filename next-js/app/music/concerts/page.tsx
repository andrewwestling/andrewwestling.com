import database from "@music/data/database";
import { getDateForSorting } from "@music/lib/helpers";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { ServerFilters } from "@music/components/ServerFilters";

export default async function ConcertsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  let concerts = [...database.concert];

  if (searchParams.group) {
    const group = database.group.find((g) => g.slug === searchParams.group);
    if (group) {
      concerts = concerts.filter(
        (concert) => concert.frontmatter.group === group.title
      );
    }
  }

  if (searchParams.season) {
    const season = database.season.find((s) => s.slug === searchParams.season);
    if (season) {
      concerts = concerts.filter(
        (concert) => concert.frontmatter.season === season.title
      );
    }
  }

  if (searchParams.conductor) {
    const conductor = database.conductor.find(
      (c) => c.slug === searchParams.conductor
    );
    if (conductor) {
      concerts = concerts.filter((concert) => {
        const conductors = Array.isArray(concert.frontmatter.conductor)
          ? concert.frontmatter.conductor
          : [concert.frontmatter.conductor];
        return conductors.includes(conductor.title);
      });
    }
  }

  if (searchParams.venue) {
    const venue = database.venue.find((v) => v.slug === searchParams.venue);
    if (venue) {
      concerts = concerts.filter(
        (concert) => concert.frontmatter.venue === venue.title
      );
    }
  }

  // Sort concerts by date
  concerts.sort((a, b) => {
    const dateA = getDateForSorting(a.frontmatter.date);
    const dateB = getDateForSorting(b.frontmatter.date);
    return dateB - dateA;
  });

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6">Concerts</h1>

      <ServerFilters facets={["group", "season", "conductor", "venue"]} />

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
