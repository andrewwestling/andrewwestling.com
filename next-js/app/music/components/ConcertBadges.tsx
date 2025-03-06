import { DidNotPlay } from "@music/components/DidNotPlay";
import { HappeningNow } from "@music/components/HappeningNow";
import { Upcoming } from "@music/components/Upcoming";
import type { Concert } from "@music/data/types";
import { isUpcoming, isHappeningNow } from "@music/lib/helpers";

interface ConcertBadgesProps {
  concert: Concert;
}

export const ConcertBadges = ({ concert }: ConcertBadgesProps) => {
  return (
    <span className="inline-flex gap-2">
      {concert.frontmatter.didNotPlay && <DidNotPlay />}
      {isHappeningNow(concert) && <HappeningNow />}
      {isUpcoming(concert) && !isHappeningNow(concert) && <Upcoming />}
    </span>
  );
};
