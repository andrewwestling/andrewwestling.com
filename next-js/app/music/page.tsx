import Link from "next/link";
import { Metadata } from "next";
import { routes } from "./lib/routes";
import { PageTitle } from "./components/PageTitle";

export const metadata: Metadata = {
  title: "Music Library",
  description: "Andrew's archive of concerts and works performed",
};

export default async function HomePage() {
  const linkClasses = [
    "bg-surface",
    "dark:bg-surface-dark",
    "p-3",
    "py-6",
    "rounded-md",
    "cursor-pointer",
    "flex",
    "flex-row",
    "items-center",
    "justify-center",
    "shadow-sm",
    "hover:shadow-md",
    "dark:hover:border-muted",
    "border",
    "border-border",
    "dark:border-border-dark",
    "transition-all",
    "duration-300",
    "ease-in-out",
  ].join(" ");

  return (
    <div className="grid gap-6">
      <section className="my-6 flex flex-col gap-2">
        <PageTitle className="md:text-4xl font-semibold">{`Andrew's Music Library`}</PageTitle>
        <p className="text-sm md:text-base text-muted italic">
          {`"Probably every concert and work I've ever performed"`}
        </p>
      </section>

      {/* Browse links */}
      <div className="grid md:grid-cols-6 gap-6">
        {/* Upcoming Concerts */}
        <Link
          className={`${linkClasses} flex gap-1 no-underline md:col-span-3`}
          href={routes.upcoming()}
        >
          <span className="no-underline">📆</span>
          <span className="underline">Upcoming Concerts</span>
        </Link>
        {/* Bucket List */}
        <Link
          className={`${linkClasses} md:col-span-3 flex gap-1 no-underline`}
          href={routes.bucketList()}
        >
          <span className="no-underline">🤞</span>
          <span className="underline">Bucket List</span>
        </Link>
        {/* All Seasons */}
        <Link
          className={`${linkClasses} md:col-span-2`}
          href={routes.seasons.index()}
        >
          All Seasons
        </Link>
        {/* All Concerts */}
        <Link
          className={`${linkClasses} md:col-span-2`}
          href={routes.concerts.index()}
        >
          All Concerts
        </Link>
        {/* All Works */}
        <Link
          className={`${linkClasses} md:col-span-2`}
          href={routes.works.index()}
        >
          All Works
        </Link>
      </div>
    </div>
  );
}
