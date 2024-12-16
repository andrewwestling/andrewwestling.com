import Link from "next/link";

interface ListItemProps {
  title: string;
  href: string;
  stats: (string | undefined | null)[];
}

export function ListItem({ title, href, stats }: ListItemProps) {
  return (
    <div>
      <Link href={href} className="font-semibold">
        {title}
      </Link>
      <span className="text-muted text-sm ml-2">{stats.join(" • ")}</span>
    </div>
  );
}
