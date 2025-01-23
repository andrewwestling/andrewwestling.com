import { getUpcomingConcerts } from "@music/data/queries/concerts";
import { ConcertListItem } from "@music/components/ConcertListItem";
import { PageTitle } from "@music/components/PageTitle";

export default async function UpcomingPage() {
  const upcomingConcerts = getUpcomingConcerts();

  return (
    <div className="flex flex-col gap-6">
      {/* Up Next */}
      {upcomingConcerts.length > 0 && (
        <section>
          <PageTitle className="mb-4">Up Next</PageTitle>
          <div className="grid gap-4">
            {upcomingConcerts.slice(0, 1).map((concert) => (
              <ConcertListItem
                key={concert.slug}
                concert={concert}
                expanded
                showTickets={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* Later This Season */}
      {upcomingConcerts.length > 1 && (
        <section>
          <PageTitle className="mb-4">Later This Season</PageTitle>
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
    </div>
  );
}
