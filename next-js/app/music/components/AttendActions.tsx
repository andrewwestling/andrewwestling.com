import { ButtonLink } from "@components/Button";
import type { Concert } from "@music/data/types";
import { isUpcoming, isToday, formatShortDate } from "@music/lib/helpers";

interface AttendActionsProps {
  concert: Concert;
}

export const AttendActions = ({ concert }: AttendActionsProps) => {
  if (!isUpcoming(concert) && !isToday(concert)) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <ButtonLink
        icon={"📆"}
        href={`/music/concerts/${concert.slug}/event.ics`}
        external
      >
        Add to Calendar
      </ButtonLink>
      {concert.frontmatter.ticketUrl && (
        <ButtonLink icon={"🎟️"} href={concert.frontmatter.ticketUrl} external>
          Buy Tickets
        </ButtonLink>
      )}
      {concert.frontmatter.liveStreamUrl && (
        <ButtonLink
          icon={"📺"}
          href={concert.frontmatter.liveStreamUrl}
          external
        >
          Live Stream{" "}
          {formatShortDate(
            concert.frontmatter.date,
            concert.frontmatter.venue
          )}
        </ButtonLink>
      )}
    </div>
  );
};
