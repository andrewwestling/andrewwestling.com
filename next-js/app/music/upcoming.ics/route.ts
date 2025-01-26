import tzlookup from "tz-lookup";
import { DateTime } from "luxon";
import { createEvents, DateArray } from "ics";
import { getUpcomingConcerts } from "@music/data/queries/concerts";
import { getVenueByTitle } from "@music/data/queries/venues";
import { formatConcertTitle } from "@music/lib/helpers";
import { getGroupByTitle } from "@music/data/queries/groups";
import { Venue } from "@music/lib/types";
import { awdsColors } from "@/tailwind.config";

const PRIMARY_COLOR = awdsColors.primary.DEFAULT;
const DEFAULT_TIMEZONE = "America/New_York";

export async function GET() {
  const concerts = getUpcomingConcerts();

  const events = concerts.map((concert) => {
    const venue = concert.frontmatter.venue
      ? getVenueByTitle(concert.frontmatter.venue)
      : undefined;
    const group = getGroupByTitle(concert.frontmatter.group);
    const displayTitle = formatConcertTitle(concert.title, group);

    // Get timezone from venue coordinates if available
    const getTimeZone = (venue?: Venue) => {
      if (venue?.frontmatter.coordinates) {
        const [lat, lon] = venue.frontmatter.coordinates
          .split(",")
          .map((c) => parseFloat(c.trim()));
        return tzlookup(lat, lon);
      }
      return DEFAULT_TIMEZONE;
    };

    // Parse the date as local time in the venue's timezone
    const localDate = DateTime.fromISO(
      concert.frontmatter.date.replace("Z", ""),
      { zone: getTimeZone(venue) }
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
      url: `https://andrewwestling.com/music/concerts/${concert.slug}`,
      startInputType: "utc" as const,
      startOutputType: "utc" as const,
    };
  });

  const { error, value } = createEvents(events, {
    calName: "Andrew's Upcoming Concerts",
  });

  if (error) {
    console.error(error);
    return new Response("Error generating calendar", { status: 500 });
  }

  // Add calendar color by splicing it in after BEGIN:VCALENDAR
  const valueWithColor = value?.replace(
    "BEGIN:VCALENDAR",
    `BEGIN:VCALENDAR\r\nX-APPLE-CALENDAR-COLOR:${PRIMARY_COLOR}`
  );

  return new Response(valueWithColor, {
    headers: {
      "Content-Type": "text/calendar",
      "Content-Disposition":
        'attachment; filename="andrews-upcoming-concerts.ics"',
    },
  });
}
