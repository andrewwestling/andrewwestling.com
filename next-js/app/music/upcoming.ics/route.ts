import { getUpcomingConcerts } from "@music/data/queries/concerts";
import { concertToEvent, generateCalendarResponse } from "@music/lib/calendar";

export async function GET() {
  const concerts = getUpcomingConcerts();
  const events = concerts.map(concertToEvent);

  return generateCalendarResponse({
    events,
    calendarName: "Andrew's Upcoming Concerts",
    filename: "andrews-upcoming-concerts.ics",
  });
}
