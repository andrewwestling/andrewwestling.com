import Link from "next/link";

interface ListItemProps {
  title: string;
  href: string;
  stats: (string | undefined | null)[];
  statsBadges?: React.ReactNode[];
  titleBadges?: React.ReactNode[];
  className?: string;
}

export function ListItem({
  title,
  href,
  stats,
  statsBadges = [],
  titleBadges = [],
  className = "",
}: ListItemProps) {
  const statsBadgeSlot = statsBadges.map((stat, index) => (
    <span key={index}>{stat}</span>
  ));
  const titleBadgeSlot = titleBadges.map((badge, index) => (
    <span key={index}>{badge}</span>
  ));
  return (
    <div className={className}>
      <div className="flex items-center">
        <Link href={href} className="text-preset-3-bold">
          {title}
        </Link>
        {titleBadgeSlot && <span className="ml-2">{titleBadgeSlot}</span>}
      </div>

      <p className="text-preset-2 text-muted">
        <span>{stats.join(" • ")}</span>
        <span className="ml-2">{statsBadgeSlot}</span>
      </p>
    </div>
  );
}
