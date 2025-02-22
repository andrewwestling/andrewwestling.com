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
    <article className="space-y-6">
      <div className="space-y-4">
        <div className="text-preset-3 flex items-center gap-2">
          <span>{formattedDate}</span>
        </div>
        <h3 className="text-preset-7">
          <Link href={routes.concerts.show(concert.slug)}>{displayTitle}</Link>
        </h3>
      </div>

      <div className="space-y-4">
        {venue && (
          <>
            <Link href={routes.venues.show(venue.slug)}>{venue.title}</Link>
            {venue.frontmatter.coordinates && (
              <span className="text-preset-2 ml-2">
                (
                {await getLocationFromCoordinates(
                  venue.frontmatter.coordinates
                )}
                )
              </span>
            )}
          </>
        )}
        {group && (
          <div>
            <Link href={routes.groups.show(group.slug)}>{group.title}</Link>
          </div>
        )}
        {conductors.length > 0 && (
          <span>
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
            <span>, conductor{conductors.length > 1 ? "s" : ""}</span>
          </span>
        )}
      </div>

      {showAttendActions && isUpcoming(concert) && (
        <AttendActions concert={concert} />
      )}
    </article>
  );
}
