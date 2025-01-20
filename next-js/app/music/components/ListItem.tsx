import Link from "next/link";
import { BucketList } from "@music/components/BucketList";

interface ListItemProps {
  title: string;
  href: string;
  stats: (string | undefined | null)[];
  bucketList?: boolean;
  className?: string;
}

export function ListItem({
  title,
  href,
  stats,
  bucketList,
  className = "",
}: ListItemProps) {
  return (
    <div className={className}>
      <Link href={href} className="font-semibold">
        {title}
      </Link>
      <span className="text-muted text-sm ml-2">{stats.join(" • ")}</span>
      {bucketList && (
        <span className="ml-2">
          <BucketList />
        </span>
      )}
    </div>
  );
}
