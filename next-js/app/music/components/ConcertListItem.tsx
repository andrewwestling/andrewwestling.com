import Link from "next/link";
import { ConcertBadges } from "./ConcertBadges";
import {
  formatConcertTitle,
  formatDate,
  findConductorSlug,
} from "@music/lib/helpers";
import { routes } from "@music/lib/routes";
import { Concert } from "@music/lib/types";
import { getLocationFromCoordinates } from "@music/lib/location";
import { ExternalLink } from "./ExternalLink";
import { getGroupByTitle } from "@music/data/queries/groups";
import { getVenueByTitle } from "@music/data/queries/venues";

interface ConcertListItemProps {
  concert: Concert;
  expanded?: boolean;
  showTickets?: boolean;
}

export async function ConcertListItem({
  concert,
  expanded = false,
  showTickets = false,
}: ConcertListItemProps) {
  const group = getGroupByTitle(concert.frontmatter.group);
  const venue = concert.frontmatter.venue
    ? getVenueByTitle(concert.frontmatter.venue)
    : undefined;
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
        <div className="flex items-center gap-1 text-muted text-sm">
          <p>{formattedDate}</p>
          {showTickets && concert.frontmatter.ticketUrl && (
            <>
              {" • "}
              <ExternalLink
                className="text-primary"
                href={concert.frontmatter.ticketUrl}
              >
                Buy Tickets
              </ExternalLink>
            </>
          )}
        </div>
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
                <span className="text-muted text-sm ml-2">
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
        {showTickets && concert.frontmatter.ticketUrl && (
          <>
            <dt className="font-medium">Tickets</dt>
            <dd>
              <ExternalLink
                className="text-primary"
                href={concert.frontmatter.ticketUrl}
              >
                Buy Tickets
              </ExternalLink>
            </dd>
          </>
        )}
      </dl>
    </article>
  );
}
