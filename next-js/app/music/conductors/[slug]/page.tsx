import { notFound } from "next/navigation";
import { PageProps } from "@music/lib/types";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { getDateForSorting } from "../../lib/helpers";
import { PageTitle } from "@music/components/PageTitle";
import { SectionHeading } from "@music/components/SectionHeading";
import { getConductorBySlug } from "@music/data/queries/conductors";
import { getConcertsByConductor } from "@music/data/queries/concerts";

export default function ConductorPage({ params }: PageProps) {
  const conductor = getConductorBySlug(params.slug);

  if (!conductor) {
    notFound();
  }

  // Find all concerts for this conductor
  const concerts = getConcertsByConductor(conductor.title).sort((a, b) => {
    const dateA = new Date(getDateForSorting(a.frontmatter.date));
    const dateB = new Date(getDateForSorting(b.frontmatter.date));
    return dateB.getTime() - dateA.getTime(); // Sort descending (newest first)
  });

  return (
    <article className="flex flex-col gap-6">
      <div>
        <PageTitle>{conductor.title}</PageTitle>
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
