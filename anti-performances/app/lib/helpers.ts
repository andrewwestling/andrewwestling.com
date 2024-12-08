import database from "@/database";

// Helper to extract date from filename in YYYYMMDDHHmm format
export function getDateFromFilename(filename: string): string | null {
  const match = filename.match(/^(\d{12})/);
  if (!match) return null;
  return match[1];
}

// Helper to format concert title
export function formatConcertTitle(filename: string, group: { title: string } | undefined): string {
  // Extract the part in parentheses
  const parenthesesMatch = filename.match(/\((.*?)\)$/);
  const subtitle = parenthesesMatch ? parenthesesMatch[1] : "";

  return group ? `${group.title}: ${subtitle}` : subtitle || filename;
}

// Helper to safely format a date string
export function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "Date not available";

  try {
    // Parse ISO date string components directly
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
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
      hour12: true // Use 12-hour time with AM/PM
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
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
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
