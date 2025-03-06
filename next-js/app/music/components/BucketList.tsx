import Link from "next/link";

import { routes } from "@music/lib/routes";

export const BucketList = ({ played }: { played?: boolean }) => {
  return (
    <span className="awds-music-badge bg-accent text-black">
      <Link
        className={`hover:text-black ${played ? "line-through" : ""}`}
        href={routes.bucketList()}
      >
        Bucket List
      </Link>
    </span>
  );
};
