import { notFound } from "next/navigation";
import { getConcertBySlug } from "@music/data/queries/concerts";
import { concertToEvent, generateCalendarResponse } from "@music/lib/calendar";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const concert = getConcertBySlug(params.slug);
  if (!concert) {
    notFound();
  }

  const event = concertToEvent(concert);
  return generateCalendarResponse({
    events: [event],
    filename: `event.ics`,
  });
}
