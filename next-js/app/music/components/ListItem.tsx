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
      <Link href={href} className="text-preset-3-bold">
        {title}
      </Link>
      <span>
        {badges.map((badge, index) => (
          <span key={index} className="ml-2">
            {badge}
          </span>
        ))}
      </span>
      <p className="text-preset-2 text-muted flex flex-row gap-1">
        <span>{stats.join(" • ")}</span>
      </p>
    </div>
  );
}
