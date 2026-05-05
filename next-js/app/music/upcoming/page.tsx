import { Metadata } from "next";

import { CalendarUrlCopy } from "@music/components/CalendarUrlCopy";
import { ConcertInfo } from "@music/components/ConcertInfo";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { PageTitle } from "@music/components/PageTitle";
import { SectionHeading } from "@music/components/SectionHeading";
import { getUpcomingConcerts } from "@music/data/queries";
import { getCurrentSeasonSlug, getSiteUrl, isToday } from "@music/lib/helpers";
import { routes } from "@music/lib/routes";

// Revalidate every 6 hours so badges like "Today" stay up-to-date
export const revalidate = 21600;

export const metadata: Metadata = {
  title: "Upcoming Concerts",
  description: "Upcoming concerts I'm performing in",
};

export default async function UpcomingPage() {
  const upcomingConcerts = getUpcomingConcerts();
  const calendarUrl = `${getSiteUrl()}/music/upcoming.ics`;

  // A "season" runs September through August (see getCurrentSeasonYear).
  // Up Next / Later This Season only apply to concerts in the current season;
  // anything beyond that goes under Future Seasons.
  const currentSeasonSlug = getCurrentSeasonSlug();
  const thisSeasonConcerts = upcomingConcerts.filter(
    (concert) => concert.frontmatter.season === currentSeasonSlug
  );
  const futureSeasons = upcomingConcerts.filter(
    (concert) => concert.frontmatter.season !== currentSeasonSlug
  );
  const upNext =
    thisSeasonConcerts.find((concert) => isToday(concert)) ||
    thisSeasonConcerts[0];
  const laterThisSeason = thisSeasonConcerts.filter(
    (concert) => concert !== upNext
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-16">
        {/* Up Next */}
        <section className="space-y-4">
          <PageTitle>Up Next</PageTitle>
          {upNext && (
            <div className="grid gap-4 p-4 bg-surface border border-border dark:bg-surface-dark dark:border-border-dark rounded-lg">
              <ConcertInfo concert={upNext} showAttendActions />
            </div>
          )}
          {/* No concerts left this season — message varies by whether future-season concerts exist */}
          {!upNext && (
            <>
              <p>🏖️ No more concerts scheduled for this season.</p>
              {futureSeasons.length === 0 && (
                <p>
                  <a href={routes.seasons.index()}>Explore my past seasons</a>,
                  or check back soon!
                </p>
              )}
            </>
          )}
        </section>

        {/* Later This Season */}
        {laterThisSeason.length > 0 && (
          <section>
            <SectionHeading>Later This Season</SectionHeading>
            <div className="grid gap-4">
              {laterThisSeason.map((concert) => (
                <ConcertListItem key={concert.slug} concert={concert} />
              ))}
            </div>
          </section>
        )}

        {/* Future Seasons */}
        {futureSeasons.length > 0 && (
          <section>
            <SectionHeading>Future Seasons</SectionHeading>
            <div className="grid gap-4">
              {futureSeasons.map((concert) => (
                <ConcertListItem key={concert.slug} concert={concert} />
              ))}
            </div>
          </section>
        )}

        {/* Subscribe in Calendar App */}
        <section>
          <SectionHeading>Subscribe in Calendar App</SectionHeading>
          <p className="mb-4">
            Subscribe to this URL in your calendar app to see my upcoming
            concerts on your calendar:
          </p>
          <CalendarUrlCopy calendarUrl={calendarUrl} />
        </section>
      </div>
    </div>
  );
}
