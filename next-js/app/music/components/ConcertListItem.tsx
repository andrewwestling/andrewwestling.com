import Link from "next/link";
import { ConcertBadges } from "./ConcertBadges";
import {
  formatConcertTitle,
  formatDate,
  findConductorSlug,
} from "@music/lib/helpers";
import { routes } from "@music/lib/routes";
import { Concert } from "@music/lib/types";
import database from "@music/data/database";
import { findVenueFromFrontmatter } from "@music/lib/location";
import { getLocationFromCoordinates } from "@music/lib/location";

interface ConcertListItemProps {
  concert: Concert;
  expanded?: boolean;
}

export async function ConcertListItem({
  concert,
  expanded = false,
}: ConcertListItemProps) {
  const group = database.group.find(
    (g) => g.title === concert.frontmatter.group
  );
  const venue = findVenueFromFrontmatter(
    concert.frontmatter.venue,
    database.venue
  );
  const displayTitle = formatConcertTitle(concert.title, group);
  const formattedDate = formatDate(concert.frontmatter.date);

  // Get conductor(s)
  const conductors = Array.isArray(concert.frontmatter.conductor)
    ? concert.frontmatter.conductor
    : concert.frontmatter.conductor
    ? [concert.frontmatter.conductor]
    : [];

  if (!expanded) {
    return (
      <div>
        <h3 className="font-medium flex items-center gap-2">
          <Link href={routes.concerts.show(concert.slug)}>{displayTitle}</Link>
          <ConcertBadges concert={concert} />
        </h3>
        <p className="text-muted">{formattedDate}</p>
      </div>
    );
  }

  return (
    <article className="pb-6">
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <Link href={routes.concerts.show(concert.slug)}>{displayTitle}</Link>
        <ConcertBadges concert={concert} />
      </h2>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="font-medium">Date</dt>
        <dd>{formattedDate}</dd>

        <dt className="font-medium">Group</dt>
        <dd>
          {group && (
            <Link href={routes.groups.show(group.slug)}>{group.title}</Link>
          )}
        </dd>

        {venue && (
          <>
            <dt className="font-medium">Venue</dt>
            <dd>
              <Link href={routes.venues.show(venue.slug)}>{venue.title}</Link>
              {venue.frontmatter.coordinates && (
                <span className="text-muted ml-2">
                  (
                  {await getLocationFromCoordinates(
                    venue.frontmatter.coordinates
                  )}
                  )
                </span>
              )}
            </dd>
          </>
        )}

        {conductors.length > 0 && (
          <>
            <dt className="font-medium">
              Conductor{conductors.length > 1 ? "s" : ""}
            </dt>
            <dd>
              {conductors.map((conductorName, i) => (
                <span key={conductorName}>
                  {i > 0 && ", "}
                  <Link
                    href={routes.conductors.show(
                      findConductorSlug(conductorName) || ""
                    )}
                  >
                    {conductorName}
                  </Link>
                </span>
              ))}
            </dd>
          </>
        )}
      </dl>
    </article>
  );
}
