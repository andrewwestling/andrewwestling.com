import Link from "next/link";
import { routes } from "../lib/routes";

export const Upcoming = () => {
  return (
    <span className="bg-primary rounded text-xs text-white px-1 py-0.5 !font-normal whitespace-nowrap">
      <Link className="hover:text-white" href={routes.upcoming()}>
        Upcoming
      </Link>
    </span>
  );
};
