import Link from "next/link";
import { routes } from "../lib/routes";

export const BucketList = ({ played }: { played?: boolean }) => {
  return (
    <span className="bg-accent rounded text-xs text-black border-0 px-1 py-0.5 !font-normal whitespace-nowrap ml-1 underline">
      <Link
        className={`hover:text-black ${played ? "line-through" : ""}`}
        href={routes.bucketList()}
      >
        Bucket List
      </Link>
    </span>
  );
};
