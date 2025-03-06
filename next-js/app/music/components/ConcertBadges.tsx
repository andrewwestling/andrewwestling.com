import { DidNotPlay } from "@music/components/DidNotPlay";
import { Upcoming } from "@music/components/Upcoming";
import { HappeningNow } from "@music/components/HappeningNow";
import { isUpcoming, isHappeningNow } from "@music/lib/helpers";
import { Concert } from "@music/data/types";

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
