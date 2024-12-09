import { DidNotPlay } from "./DidNotPlay";
import { Upcoming } from "./Upcoming";
import { isUpcoming } from "@music/lib/helpers";
import { Concert } from "@music/lib/types";

interface ConcertBadgesProps {
  concert: Concert;
}

export const ConcertBadges = ({ concert }: ConcertBadgesProps) => {
  return (
    <>
      {concert.frontmatter.didNotPlay && <DidNotPlay />}
      {isUpcoming(concert.frontmatter.date) && <Upcoming />}
    </>
  );
};
