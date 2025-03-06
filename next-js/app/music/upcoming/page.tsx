import { Metadata } from "next";
import { getUpcomingConcerts } from "@music/data/queries/concerts";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { ConcertInfo } from "@music/components/ConcertInfo";
import { getSiteUrl, isHappeningNow } from "@music/lib/helpers";
import { SectionHeading } from "@music/components/SectionHeading";
import { CalendarUrlCopy } from "@music/components/CalendarUrlCopy";
import { PageTitle } from "@music/components/PageTitle";

// Make this page dynamic so it will stay up-to-date as concerts happen
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Upcoming Concerts",
  description: "Upcoming concerts I'm performing in",
};

export default async function UpcomingPage() {
  const upcomingConcerts = getUpcomingConcerts();
  const calendarUrl = `${getSiteUrl()}/music/upcoming.ics`;

  // Find the first happening now or upcoming concert
  const upNext =
    upcomingConcerts.find((concert) => isHappeningNow(concert)) ||
    upcomingConcerts[0];
  const laterConcerts = upcomingConcerts.filter(
    (concert) => concert !== upNext
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-16">
        {/* Up Next */}
        {upNext && (
          <section className="space-y-4">
            <PageTitle>Up Next</PageTitle>
            <div className="grid gap-4 p-4 bg-surface border border-border dark:bg-surface-dark dark:border-border-dark rounded-lg">
              <ConcertInfo concert={upNext} showAttendActions />
            </div>
          </section>
        )}

        {/* Later This Season */}
        {laterConcerts.length > 0 && (
          <section>
            <SectionHeading>Later This Season</SectionHeading>
            <div className="grid gap-4">
              {laterConcerts.map((concert) => (
                <ConcertListItem key={concert.slug} concert={concert} />
              ))}
            </div>
          </section>
        )}

        {/* If no more concerts, show a message */}
        {upcomingConcerts.length === 0 && (
          <section>
            <p>No more concerts scheduled for this season. Check back soon!</p>
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
