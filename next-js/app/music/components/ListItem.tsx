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
      <p className="text-preset-2 text-muted flex flex-row gap-2">
        <span>{stats.join(" • ")}</span>
        <span>
          {badges.map((badge, index) => (
            <span key={index}>{badge}</span>
          ))}
        </span>
      </p>
    </div>
  );
}
