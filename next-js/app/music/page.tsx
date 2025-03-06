import { Metadata } from "next";

import { ButtonLink } from "@components/Button";
import { PageTitle } from "@music/components/PageTitle";
import { routes } from "@music/lib/routes";

export const metadata: Metadata = {
  title: "Music Library",
  description: "Andrew's archive of concerts and works performed",
};

export default async function MusicPage() {
  return (
    <div className="grid gap-6">
      <section className="mb-6 flex flex-col gap-2">
        <PageTitle>{`Andrew's Music Library`}</PageTitle>
        <p className="text-sm md:text-base text-muted italic">
          {`"Probably every concert and work I've ever performed"`}
        </p>
      </section>

      {/* Browse links */}
      <div className="grid md:grid-cols-6 gap-6">
        {/* Upcoming Concerts */}
        <ButtonLink
          icon={"📆"}
          className="py-6 md:col-span-3"
          href={routes.upcoming()}
        >
          Upcoming Concerts
        </ButtonLink>
        {/* Bucket List */}
        <ButtonLink
          icon={"🤞"}
          className="py-6 md:col-span-3"
          href={routes.bucketList()}
        >
          Bucket List
        </ButtonLink>
        {/* All Seasons */}
        <ButtonLink
          className="py-6 md:col-span-2"
          href={routes.seasons.index()}
        >
          All Seasons
        </ButtonLink>
        {/* All Concerts */}
        <ButtonLink
          className="py-6 md:col-span-2"
          href={routes.concerts.index()}
        >
          All Concerts
        </ButtonLink>
        {/* All Works */}
        <ButtonLink className="py-6 md:col-span-2" href={routes.works.index()}>
          All Works
        </ButtonLink>
      </div>
    </div>
  );
}
