import { createEvents, DateArray } from "ics";
import { getUpcomingConcerts } from "@music/data/queries/concerts";
import { getVenueByTitle } from "@music/data/queries/venues";
import { formatConcertTitle } from "@music/lib/helpers";
import { getGroupByTitle } from "@music/data/queries/groups";
import { awdsColors } from "@/tailwind.config";

const PRIMARY_COLOR = awdsColors.primary.DEFAULT;

export async function GET() {
  const concerts = getUpcomingConcerts();

  const events = concerts.map((concert) => {
    const date = new Date(concert.frontmatter.date);
    const group = getGroupByTitle(concert.frontmatter.group);
    const venue = concert.frontmatter.venue
      ? getVenueByTitle(concert.frontmatter.venue)
      : undefined;
    const displayTitle = formatConcertTitle(concert.title, group);

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
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
    ];

    return {
      start,
      duration: { hours: 2 }, // Default to 2 hours since actual duration isn't stored
      title: displayTitle,
      description,
      location: venue?.title,
      url: `https://andrewwestling.com/music/concerts/${concert.slug}`,
    };
  });

  const { error, value } = createEvents(events, {
    calName: "Andrew's Upcoming Concerts",
  });

  if (error) {
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
