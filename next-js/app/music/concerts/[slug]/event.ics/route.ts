import { notFound } from "next/navigation";

import { getConcertBySlug } from "@music/data/queries";
import { concertToEvent, generateCalendarResponse } from "@music/lib/calendar";

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
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
