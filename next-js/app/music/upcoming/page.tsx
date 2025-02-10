import { Metadata } from "next";
import { getUpcomingConcerts } from "@music/data/queries/concerts";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { getSiteUrl } from "@music/lib/helpers";
import { SectionHeading } from "../components/SectionHeading";
import { CalendarUrlCopy } from "../components/CalendarUrlCopy";
import { PageTitle } from "../components/PageTitle";

/**
 * Revalidate every hour so the "up next" concert will be correct after the concert happens
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Upcoming Concerts",
  description: "Upcoming concerts I'm performing in",
};

export default async function UpcomingPage() {
  const upcomingConcerts = getUpcomingConcerts();
  const calendarUrl = `${getSiteUrl()}/music/upcoming.ics`;

  return (
    <div className="flex flex-col gap-6">
      <PageTitle>Upcoming Concerts</PageTitle>
      <div className="flex flex-col gap-16">
        {/* Up Next */}
        {upcomingConcerts.length > 0 && (
          <section>
            <SectionHeading>Up Next</SectionHeading>
            <div className="grid gap-4">
              {upcomingConcerts.slice(0, 1).map((concert) => (
                <ConcertListItem
                  key={concert.slug}
                  concert={concert}
                  expanded
                  showAttendActions
                />
              ))}
            </div>
          </section>
        )}

        {/* Later This Season */}
        {upcomingConcerts.length > 1 && (
          <section>
            <SectionHeading>Later This Season</SectionHeading>
            {upcomingConcerts.length > 0 && (
              <div className="grid gap-4">
                {upcomingConcerts.slice(1).map((concert) => (
                  <ConcertListItem key={concert.slug} concert={concert} />
                ))}
              </div>
            )}
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
