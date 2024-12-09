import Link from "next/link";
import database from "@music/data/database";
import { PageProps } from "@music/lib/types";
import { getDateFromFilename } from "@music/lib/helpers";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

// Import the map component dynamically to avoid SSR issues
const VenueMap = dynamic(() => import("@music/components/VenueMap"), {
  ssr: false,
});

export default function VenuePage({ params }: PageProps) {
  const venue = database.venue.find((v) => v.slug === params.slug);
  if (!venue) notFound();

  const concerts = database.concert.filter(
    (c) => c.frontmatter.venue === `[[${venue.title}]]`
  );

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-8">{venue.title}</h1>

      <div className="grid gap-8">
        {/* Venue Details */}
        <section>
          {venue.frontmatter.coordinates && (
            <VenueMap
              coordinates={venue.frontmatter.coordinates}
              venueName={venue.title}
            />
          )}

          {venue.content && (
            <div className="prose dark:prose-invert mt-4">{venue.content}</div>
          )}
        </section>

        {/* Concerts */}
        {concerts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Concerts</h2>
            <div className="grid gap-4">
              {concerts.map((concert) => {
                const group = database.group.find(
                  (g) => g.title === concert.frontmatter.group
                );
                const date = getDateFromFilename(concert.slug);
                return (
                  <div key={concert.slug}>
                    <Link href={`/concerts/${concert.slug}`}>
                      {concert.title}
                    </Link>
                    {group && (
                      <span className="text-muted ml-2">
                        with{" "}
                        <Link href={`/groups/${group.slug}`}>
                          {group.title}
                        </Link>
                      </span>
                    )}
                    {date && (
                      <span className="text-muted ml-2">
                        on {new Date(date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return database.venue.map((venue) => ({
    slug: venue.slug,
  }));
}
