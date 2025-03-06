import { ButtonLink } from "@components/Button";
import type { Concert } from "@music/data/types";
import { isUpcoming } from "@music/lib/helpers";

interface AttendActionsProps {
  concert: Concert;
}

export const AttendActions = ({ concert }: AttendActionsProps) => {
  if (!isUpcoming(concert)) {
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
    </div>
  );
};
