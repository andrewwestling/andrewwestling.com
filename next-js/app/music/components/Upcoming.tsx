import Link from "next/link";
import { routes } from "../lib/routes";

export const Upcoming = () => {
  return (
    <span className="awds-music-badge bg-primary text-white">
      <Link className="hover:text-white" href={routes.upcoming()}>
        Upcoming
      </Link>
    </span>
  );
};
