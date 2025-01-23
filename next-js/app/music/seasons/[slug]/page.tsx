import { notFound } from "next/navigation";
import Link from "next/link";
import { PageProps } from "@music/lib/types";
import { routes } from "@music/lib/routes";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { formatComposerName, formatWorkTitle } from "../../lib/helpers";
import { ListItem } from "../../components/ListItem";
import { getSeasonBySlug } from "@music/data/queries/seasons";
import { getConcertsBySeason } from "@music/data/queries/concerts";
import { getWorksBySeason } from "@music/data/queries/works";

export default function SeasonPage({ params }: PageProps) {
  const season = getSeasonBySlug(params.slug);

  if (!season) {
    notFound();
  }

  // Find concerts for this season
  const concerts = getConcertsBySeason(season.slug);

  // Find works for this season
  const works = getWorksBySeason(season.slug);

  return (
    <article className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">{season.title}</h1>
      </div>

      {concerts.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Concerts</h2>
          <div className="grid gap-4">
            {concerts.map((concert) => (
              <ConcertListItem key={concert.slug} concert={concert} />
            ))}
          </div>
        </section>
      )}

      {works.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Works</h2>
          <div className="grid gap-4">
            {works.map((work) => (
              <ListItem
                key={work.slug}
                title={formatWorkTitle(work)}
                href={routes.works.show(work.slug)}
                stats={[
                  work.frontmatter.composer &&
                    formatComposerName(work.frontmatter.composer),
                ].filter(Boolean)}
                bucketList={work.bucketList}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
