import { ConcertBadges } from "./ConcertBadges";
import { formatConcertTitle, formatDate } from "@music/lib/helpers";
import { routes } from "@music/lib/routes";
import { Concert } from "@music/lib/types";
import { getGroupByTitle } from "@music/data/queries/groups";
import { ListItem } from "./ListItem";

interface ConcertListItemProps {
  concert: Concert;
  showAttendActions?: boolean;
}

export async function ConcertListItem({ concert }: ConcertListItemProps) {
  const group = getGroupByTitle(concert.frontmatter.group);
  const displayTitle = formatConcertTitle(concert.title, group);
  const formattedDate = formatDate(concert.frontmatter.date);

  return (
    <ListItem
      title={displayTitle}
      href={routes.concerts.show(concert.slug)}
      stats={[formattedDate]}
      statsBadges={[<ConcertBadges key={concert.slug} concert={concert} />]}
    />
  );
}
