import { DidNotPlay } from "@music/components/DidNotPlay";
import { Today } from "@music/components/Today";
import { Upcoming } from "@music/components/Upcoming";
import type { Concert } from "@music/data/types";
import { isUpcoming, isToday } from "@music/lib/helpers";

interface ConcertBadgesProps {
  concert: Concert;
}

export const ConcertBadges = ({ concert }: ConcertBadgesProps) => {
  return (
    <span className="inline-flex gap-2">
      {concert.frontmatter.didNotPlay && <DidNotPlay />}
      {isToday(concert) && <Today />}
      {isUpcoming(concert) && !isToday(concert) && <Upcoming />}
    </span>
  );
};
