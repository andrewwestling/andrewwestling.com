import { DidNotPlay } from "./DidNotPlay";
import { Upcoming } from "./Upcoming";
import { HappeningNow } from "./HappeningNow";
import { isUpcoming, isHappeningNow } from "@music/lib/helpers";
import { Concert } from "@music/lib/types";

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
