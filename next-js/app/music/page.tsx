import { Metadata } from "next";

import { ButtonLink } from "@components/Button";
import { PageTitle } from "@music/components/PageTitle";
import { SectionHeading } from "@music/components/SectionHeading";
import { routes } from "@music/lib/routes";

export const metadata: Metadata = {
  title: "Music Library",
  description: "Andrew's archive of concerts and works performed",
};

export default async function MusicPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <PageTitle>{`Andrew's Music Library`}</PageTitle>
        <p className="text-sm md:text-base text-muted italic">
          {`"Probably every concert and work I've ever performed"`}
        </p>
      </section>

      {/* Primary Actions */}
      <section className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ButtonLink icon={"📆"} className="py-6" href={routes.upcoming()}>
            Upcoming Concerts
          </ButtonLink>
          <ButtonLink icon={"🤞"} className="py-6" href={routes.bucketList()}>
            Bucket List
          </ButtonLink>
        </div>
      </section>

      {/* Explore Links */}
      <section className="flex flex-col gap-4">
        <SectionHeading>Explore</SectionHeading>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <ButtonLink className="py-4" href={routes.seasons.index()}>
            All Seasons
          </ButtonLink>
          <ButtonLink className="py-4" href={routes.concerts.index()}>
            All Concerts
          </ButtonLink>
          <ButtonLink className="py-4" href={routes.works.index()}>
            All Works
          </ButtonLink>
          <ButtonLink className="py-4" href={routes.groups.index()}>
            All Groups
          </ButtonLink>
          <ButtonLink className="py-4" href={routes.conductors.index()}>
            All Conductors
          </ButtonLink>
          <ButtonLink className="py-4" href={routes.venues.index()}>
            All Venues
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
