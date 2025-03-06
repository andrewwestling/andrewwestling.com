import { getConcertsBySeason } from "@music/data/queries/concerts";
import { concertToEvent, generateCalendarResponse } from "@music/lib/calendar";
import { getCurrentSeasonSlug } from "@music/lib/helpers";

export async function GET() {
  const currentSeasonSlug = getCurrentSeasonSlug();
  const concerts = currentSeasonSlug
    ? getConcertsBySeason(currentSeasonSlug)
    : [];
  const events = concerts.map(concertToEvent);

  return generateCalendarResponse({
    events,
    calendarName: "Andrew's Upcoming Concerts",
    filename: "andrews-upcoming-concerts.ics",
  });
}
