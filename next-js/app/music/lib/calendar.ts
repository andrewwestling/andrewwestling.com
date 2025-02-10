import { DateTime } from "luxon";
import { createEvents, DateArray, EventAttributes } from "ics";
import { Concert } from "@music/lib/types";
import {
  formatConcertTitle,
  getSiteUrl,
  getVenueTimeZone,
} from "@music/lib/helpers";
import { getVenueByTitle } from "@music/data/queries/venues";
import { getGroupByTitle } from "@music/data/queries/groups";
import { awdsColors } from "@andrewwestling/tailwind-config";

const PRIMARY_COLOR = awdsColors.primary.DEFAULT;

// Convert a concert into an ICS event object
export function concertToEvent(concert: Concert): EventAttributes {
  const venue = concert.frontmatter.venue
    ? getVenueByTitle(concert.frontmatter.venue)
    : undefined;
  const group = getGroupByTitle(concert.frontmatter.group);
  const displayTitle = formatConcertTitle(concert.title, group);

  // Parse the date as local time in the venue's timezone
  const localDate = DateTime.fromISO(
    concert.frontmatter.date.replace("Z", ""),
    { zone: getVenueTimeZone(venue) }
  );

  // Convert to UTC for the calendar
  const utcDate = localDate.toUTC();

  // Create description with program and ticket link if available
  const description = [
    // Add program if available
    concert.frontmatter.works &&
      concert.frontmatter.works.length > 0 &&
      `Program:\n${concert.frontmatter.works.join("\n")}`,
    // Add ticket link if available
    concert.frontmatter.ticketUrl &&
      `Tickets: ${concert.frontmatter.ticketUrl}`,
    // Add Spotify playlist if available
    concert.frontmatter.spotifyPlaylistUrl &&
      `Spotify Playlist: ${concert.frontmatter.spotifyPlaylistUrl}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const start: DateArray = [
    utcDate.year,
    utcDate.month,
    utcDate.day,
    utcDate.hour,
    utcDate.minute,
  ];

  return {
    start,
    duration: { hours: 2 }, // Default to 2 hours since actual duration isn't stored
    title: displayTitle,
    description,
    location: venue?.title,
    url: `${getSiteUrl()}/music/concerts/${concert.slug}`,
    startInputType: "utc" as const,
    startOutputType: "utc" as const,
  };
}

interface GenerateCalendarOptions {
  events: EventAttributes[];
  calendarName?: string;
  filename: string;
}

// Generate an ICS calendar response
export function generateCalendarResponse({
  events,
  calendarName,
  filename,
}: GenerateCalendarOptions): Response {
  const { error, value } = createEvents(events, {
    calName: calendarName,
  });

  if (error) {
    console.error(error);
    return new Response("Error generating calendar", { status: 500 });
  }

  // Add calendar color
  const valueWithColor = value?.replace(
    "BEGIN:VCALENDAR",
    `BEGIN:VCALENDAR\r\nX-APPLE-CALENDAR-COLOR:${PRIMARY_COLOR}`
  );

  return new Response(valueWithColor, {
    headers: {
      "Content-Type": "text/calendar",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
