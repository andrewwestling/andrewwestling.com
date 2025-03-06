import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDateForSorting } from "@music/lib/helpers";
import type { PageProps } from "@music/data/types";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { ExternalLink } from "@components/ExternalLink";
import { PageTitle } from "@music/components/PageTitle";
import { SectionHeading } from "@music/components/SectionHeading";
import { getGroupBySlug, getConcertsByGroup } from "@music/data/queries";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const group = getGroupBySlug(decodeURIComponent(params.slug));
  if (!group) return { title: "Not Found" };

  return {
    title: group.title,
    description: `Concerts I've performed with ${group.title}`,
  };
}

export default async function GroupPage(props: PageProps) {
  const params = await props.params;
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
