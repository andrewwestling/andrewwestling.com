import database from "@music/data/database";
import { Work } from "./types";

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
  const conductor = database.conductor.find((c) => c.title === name);
  return conductor?.slug;
}

export function isUpcoming(date: string): boolean {
  return new Date(date) >= new Date();
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

export function getCurrentSeasonSlug(seasons: any[]): string | null {
  const currentYear = getCurrentSeasonYear();
  const expectedSeasonTitle = `${currentYear}-${currentYear + 1}`;
  const currentSeason = seasons.find((s) => s.title === expectedSeasonTitle);
  return currentSeason?.slug || null;
}

export function resolveSeasonSlug(
  seasonSlug: string,
  seasons: any[]
): string | null {
  if (seasonSlug === "current") {
    return getCurrentSeasonSlug(seasons);
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
