import Link from "next/link";

interface ListItemProps {
  title: string;
  href: string;
  stats: (string | undefined | null)[];
  badges?: React.ReactNode[];
  className?: string;
}

export function ListItem({
  title,
  href,
  stats,
  badges = [],
  className = "",
}: ListItemProps) {
  return (
    <div className={className}>
      <Link href={href} className="font-semibold">
        {title}
      </Link>
      <span>
        {badges.map((badge, index) => (
          <span key={index} className="ml-2">
            {badge}
          </span>
        ))}
      </span>
      <p className="text-muted text-sm flex flex-row gap-1">
        <span>{stats.join(" • ")}</span>
      </p>
    </div>
  );
}
