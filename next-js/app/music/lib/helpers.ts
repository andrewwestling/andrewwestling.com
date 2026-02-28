import { DateTime } from "luxon";
import tzlookup from "tz-lookup";

import {
  getConductorByTitle,
  getSeasons,
  getVenueByTitle,
  getConcerts,
} from "@music/data/queries";
import type { Concert, Work, Season } from "@music/data/types";

// Get timezone from venue coordinates if available, otherwise use New York
export function getVenueTimeZone(venue?: {
  frontmatter: { coordinates?: string };
}) {
  const DEFAULT_TIMEZONE = "America/New_York";

  if (venue?.frontmatter.coordinates) {
    const [lat, lon] = venue.frontmatter.coordinates
      .split(",")
      .map((c) => parseFloat(c.trim()));
    return tzlookup(lat, lon);
  }
  return DEFAULT_TIMEZONE;
}

// Helper to extract date from frontmatter
export function getDateFromFrontmatter(concert: {
  frontmatter: { date?: string };
}): Date | null {
  if (!concert.frontmatter.date) return null;
  const date = new Date(concert.frontmatter.date);
  return isNaN(date.getTime()) ? null : date;
}

// Helper to format concert title
export function formatConcertTitle(
  filename: string,
  group: { title: string } | undefined
): string {
  // Extract the part in parentheses
  const parenthesesMatch = filename.match(/\((.*?)\)$/);
  const subtitle = parenthesesMatch ? parenthesesMatch[1] : "";

  if (!group) return subtitle || filename;

  return subtitle ? `${group.title}: ${subtitle}` : group.title;
}

// Helper to safely format a date string
export function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "Date not available";

  try {
    // Parse ISO date string components directly
    const match = dateStr.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
    );
    if (!match) return "Invalid date format";

    const [_, year, month, day, hour, minute] = match;

    // Create Date object with explicit local components
    const localDate = new Date(
      parseInt(year),
      parseInt(month) - 1, // Months are 0-based
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );

    if (isNaN(localDate.getTime())) return "Invalid date";

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true, // Use 12-hour time with AM/PM
    };

    return localDate.toLocaleString("en-US", options).replace(":00", ""); // Remove :00 for clean times
  } catch (e) {
    return "Invalid date";
  }
}

// Helper to format a short date like "2/15 at 2 PM EST"
export function formatShortDate(
  dateStr: string | undefined,
  venueName?: string | null
): string {
  if (!dateStr) return "";
  const match = dateStr.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
  );
  if (!match) return "";
  const [_, year, month, day, hour, minute] = match;
  const m = parseInt(month);
  const d = parseInt(day);
  const h = parseInt(hour);
  const min = parseInt(minute);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  const timeStr =
    min === 0
      ? `${h12} ${ampm}`
      : `${h12}:${min.toString().padStart(2, "0")} ${ampm}`;

  // Get timezone abbreviation using Luxon + venue timezone
  const venueObj = venueName ? getVenueByTitle(venueName) : undefined;
  const zone = getVenueTimeZone(venueObj);
  const tzAbbrev = DateTime.fromISO(dateStr.replace("Z", ""), {
    zone,
  }).toFormat("ZZZZ");

  return `${m}/${d} at ${timeStr} ${tzAbbrev}`;
}

// Helper to safely get a date for sorting
export function getDateForSorting(dateStr: string | undefined): number {
  if (!dateStr) return 0;

  try {
    // Parse ISO date string components directly
    const match = dateStr.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
    );
    if (!match) return 0;

    const [_, year, month, day, hour, minute] = match;

    // Create Date object with explicit local components
    const localDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );

    return isNaN(localDate.getTime()) ? 0 : localDate.getTime();
  } catch (e) {
    return 0;
  }
}

// Helper to find a conductor by their title and get their slug
export function findConductorSlug(name: string): string | undefined {
  const conductor = getConductorByTitle(name);
  return conductor?.slug;
}

export function isUpcoming(concert: Concert): boolean {
  const venueObj = concert.frontmatter.venue
    ? getVenueByTitle(concert.frontmatter.venue)
    : undefined;
  const now = DateTime.now();

  // Parse the concert date in its local timezone
  const concertDate = DateTime.fromISO(
    concert.frontmatter.date.replace("Z", ""),
    { zone: getVenueTimeZone(venueObj) }
  );

  // Compare with current time
  return now < concertDate;
}

export function isToday(concert: Concert): boolean {
  const venueObj = concert.frontmatter.venue
    ? getVenueByTitle(concert.frontmatter.venue)
    : undefined;
  const zone = getVenueTimeZone(venueObj);
  const now = DateTime.now().setZone(zone);

  // Parse the concert date in its local timezone
  const concertDate = DateTime.fromISO(
    concert.frontmatter.date.replace("Z", ""),
    { zone }
  );

  // Concert is today if it falls on the same calendar day in the venue's timezone
  return now.hasSame(concertDate, "day");
}

export function getCurrentSeasonYear(): number {
  const now = new Date();
  const year = now.getFullYear();
  // If we're before September, we're in the previous year's season
  if (now.getMonth() < 8) {
    // JavaScript months are 0-based, so 8 is September
    return year - 1;
  }
  return year;
}

// Helper to format work titles by removing composer prefix
export function formatWorkTitle(work: Work): string {
  // Look for the first " - " that separates composer from work title
  const composerSeparatorIndex = work.title.indexOf(" - ");
  if (composerSeparatorIndex === -1) return work.title;

  // Get the base title
  const baseTitle = work.title.slice(composerSeparatorIndex + 3).trim();

  // Use displayName from frontmatter if present
  const titleToUse = work.frontmatter?.displayName || baseTitle;

  // If no catalogue number provided, return just the title
  if (!work.frontmatter?.catalogue) return titleToUse;

  // If catalogue is a number, format as "Op. X", otherwise use as-is
  const catalogueString = /^\d+$/.test(work.frontmatter.catalogue)
    ? `Op. ${work.frontmatter.catalogue}`
    : work.frontmatter.catalogue;

  return `${titleToUse}${
    work.frontmatter.catalogue ? `, ${catalogueString}` : ""
  }`;
}

export function getCurrentSeasonSlug(): string | null {
  const currentYear = getCurrentSeasonYear();
  const expectedSeasonTitle = `${currentYear}-${currentYear + 1}`;
  const seasons = getSeasons();
  const currentSeason = seasons.find((s) => s.title === expectedSeasonTitle);
  return currentSeason?.slug || null;
}

export function resolveSeasonSlug(seasonSlug: string): string | null {
  if (seasonSlug === "current") {
    return getCurrentSeasonSlug();
  }
  return seasonSlug;
}

export function formatComposerName(name: string): string {
  // Split on comma and trim whitespace
  const parts = name.split(",").map((part) => part.trim());
  if (parts.length !== 2) return name;

  // Return in firstname lastname format
  return `${parts[1]} ${parts[0]}`;
}

/**
 * Gets the full site URL based on the current environment:
 * - In development: http://localhost:3000
 * - On Vercel: Uses VERCEL_URL (preview or production)
 * - Fallback: https://andrewwestling.com
 */
export function getSiteUrl(): string {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "https://andrewwestling.com";
}

/**
 * Gets the next concert chronologically after the given concert
 */
export function getNextConcert(currentConcertSlug: string): Concert | null {
  const concerts = getConcerts();
  const currentConcert = concerts.find((c) => c.slug === currentConcertSlug);
  if (!currentConcert) return null;

  // Sort concerts by date
  const sortedConcerts = concerts.sort((a, b) => {
    const dateA = getDateForSorting(a.frontmatter.date);
    const dateB = getDateForSorting(b.frontmatter.date);
    return dateA - dateB;
  });

  // Find the index of the current concert
  const currentIndex = sortedConcerts.findIndex(
    (c) => c.slug === currentConcertSlug
  );
  if (currentIndex === -1 || currentIndex === sortedConcerts.length - 1)
    return null;

  // Return the next concert
  return sortedConcerts[currentIndex + 1];
}

/**
 * Gets the previous concert chronologically before the given concert
 */
export function getPreviousConcert(currentConcertSlug: string): Concert | null {
  const concerts = getConcerts();
  const currentConcert = concerts.find((c) => c.slug === currentConcertSlug);
  if (!currentConcert) return null;

  // Sort concerts by date
  const sortedConcerts = concerts.sort((a, b) => {
    const dateA = getDateForSorting(a.frontmatter.date);
    const dateB = getDateForSorting(b.frontmatter.date);
    return dateA - dateB;
  });

  // Find the index of the current concert
  const currentIndex = sortedConcerts.findIndex(
    (c) => c.slug === currentConcertSlug
  );
  if (currentIndex === -1 || currentIndex === 0) return null;

  // Return the previous concert
  return sortedConcerts[currentIndex - 1];
}

/**
 * Gets the next season chronologically after the given season
 */
export function getNextSeason(currentSeasonSlug: string): Season | null {
  const seasons = getSeasons();
  const currentSeason = seasons.find((s) => s.slug === currentSeasonSlug);
  if (!currentSeason) return null;

  // Sort seasons by year (they're in YYYY-YYYY format)
  const sortedSeasons = seasons.sort((a, b) => {
    const yearA = parseInt(a.title.split("-")[0]);
    const yearB = parseInt(b.title.split("-")[0]);
    return yearA - yearB;
  });

  // Find the index of the current season
  const currentIndex = sortedSeasons.findIndex(
    (s) => s.slug === currentSeasonSlug
  );
  if (currentIndex === -1 || currentIndex === sortedSeasons.length - 1)
    return null;

  // Return the next season
  return sortedSeasons[currentIndex + 1];
}

/**
 * Gets the previous season chronologically before the given season
 */
export function getPreviousSeason(currentSeasonSlug: string): Season | null {
  const seasons = getSeasons();
  const currentSeason = seasons.find((s) => s.slug === currentSeasonSlug);
  if (!currentSeason) return null;

  // Sort seasons by year (they're in YYYY-YYYY format)
  const sortedSeasons = seasons.sort((a, b) => {
    const yearA = parseInt(a.title.split("-")[0]);
    const yearB = parseInt(b.title.split("-")[0]);
    return yearA - yearB;
  });

  // Find the index of the current season
  const currentIndex = sortedSeasons.findIndex(
    (s) => s.slug === currentSeasonSlug
  );
  if (currentIndex === -1 || currentIndex === 0) return null;

  // Return the previous season
  return sortedSeasons[currentIndex - 1];
}
