import Link from "next/link";
import { ConcertBadges } from "./ConcertBadges";
import {
  formatConcertTitle,
  formatDate,
  findConductorSlug,
  isUpcoming,
} from "@music/lib/helpers";
import { routes } from "@music/lib/routes";
import { Concert } from "@music/lib/types";
import { getLocationFromCoordinates } from "@music/lib/location";
import { getGroupByTitle } from "@music/data/queries/groups";
import { getVenueByTitle } from "@music/data/queries/venues";
import { SectionHeading } from "./SectionHeading";
import { ListItem } from "./ListItem";
import { AttendActions } from "./AttendActions";

interface ConcertListItemProps {
  concert: Concert;
  expanded?: boolean;
  showAttendActions?: boolean;
}

export async function ConcertListItem({
  concert,
  expanded = false,
  showAttendActions = false,
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
      <ListItem
        title={displayTitle}
        href={routes.concerts.show(concert.slug)}
        stats={[formattedDate]}
        badges={[<ConcertBadges key={concert.slug} concert={concert} />]}
      />
    );
  }

  return (
    <article className="flex flex-col gap-6">
      <div>
        <span className="text-preset-3-bold mb-2 flex items-center gap-2">
          <Link href={routes.concerts.show(concert.slug)}>{displayTitle}</Link>
          <ConcertBadges concert={concert} />
        </span>
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
        </dl>
      </div>

      {showAttendActions && isUpcoming(concert.frontmatter.date) && (
        <AttendActions concert={concert} />
      )}
    </article>
  );
}
