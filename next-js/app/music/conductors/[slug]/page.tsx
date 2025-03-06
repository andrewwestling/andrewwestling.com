import { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PageProps } from "@music/data/types";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { getDateForSorting } from "@music/lib/helpers";
import { PageTitle } from "@music/components/PageTitle";
import { SectionHeading } from "@music/components/SectionHeading";
import {
  getConductorBySlug,
  getConcertsByConductor,
} from "@music/data/queries";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const conductor = getConductorBySlug(decodeURIComponent(params.slug));
  if (!conductor) return { title: "Not Found" };

  return {
    title: conductor.title,
    description: `Concerts I've performed with ${conductor.title}`,
  };
}

export default async function ConductorPage(props: PageProps) {
  const params = await props.params;
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
