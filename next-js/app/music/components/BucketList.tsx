import Link from "next/link";
import { routes } from "../lib/routes";

export const BucketList = () => {
  return (
    <span className="bg-accent rounded text-xs text-black border-0 px-1 py-0.5 !font-normal whitespace-nowrap ml-1 ">
      <Link className="hover:text-black" href={routes.bucketList()}>
        Bucket List
      </Link>
    </span>
  );
};
