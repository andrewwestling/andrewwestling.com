import { notFound } from "next/navigation";
import database from "@music/data/database";
import { getDateForSorting } from "@music/lib/helpers";
import { PageProps } from "@music/lib/types";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { ExternalLink } from "@music/components/ExternalLink";

export default function GroupPage({ params }: PageProps) {
  const group = database.group.find((g) => g.slug === params.slug);

  if (!group) {
    notFound();
  }

  // Find all concerts for this group and sort by date
  const concerts = [...database.concert]
    .filter((c) => c.frontmatter.group === group.title)
    .sort((a, b) => {
      const dateA = getDateForSorting(a.frontmatter.date);
      const dateB = getDateForSorting(b.frontmatter.date);
      return dateB - dateA; // Sort descending (newest first)
    });

  return (
    <article>
      <h1 className="text-2xl font-bold">{group.title}</h1>
      <p className="mb-6">
        {group.frontmatter.location}
        {group.frontmatter.url && " • "}
        {group.frontmatter.url && (
          <ExternalLink href={group.frontmatter.url}>
            {group.frontmatter.url}
          </ExternalLink>
        )}
      </p>

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
