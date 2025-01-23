import { notFound } from "next/navigation";
import { getDateForSorting } from "@music/lib/helpers";
import { PageProps } from "@music/lib/types";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { ExternalLink } from "@music/components/ExternalLink";
import { PageTitle } from "@music/components/PageTitle";
import { SectionHeading } from "@music/components/SectionHeading";
import { getGroupBySlug } from "@music/data/queries/groups";
import { getConcertsByGroup } from "@music/data/queries/concerts";

export default function GroupPage({ params }: PageProps) {
  const group = getGroupBySlug(params.slug);

  if (!group) {
    notFound();
  }

  // Find all concerts for this group and sort by date
  const concerts = getConcertsByGroup(group.title).sort((a, b) => {
    const dateA = new Date(getDateForSorting(a.frontmatter.date));
    const dateB = new Date(getDateForSorting(b.frontmatter.date));
    return dateB.getTime() - dateA.getTime(); // Sort descending (newest first)
  });

  return (
    <article className="flex flex-col gap-6">
      <div>
        <PageTitle>{group.title}</PageTitle>
        <p>
          {group.frontmatter.location}
          {group.frontmatter.url && " • "}
          {group.frontmatter.url && (
            <ExternalLink href={group.frontmatter.url}>
              {group.frontmatter.url}
            </ExternalLink>
          )}
        </p>
      </div>

      {concerts.length > 0 && (
        <div>
          <SectionHeading>Concerts</SectionHeading>
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
