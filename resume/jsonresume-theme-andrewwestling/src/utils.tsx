import React from "react";

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return "Present";

  const date = new Date(dateString + "T12:00:00");
  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatDateLong(dateString: string | undefined): string {
  if (!dateString) return "Present";

  const date = new Date(dateString + "T12:00:00");
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatYearRange(startDate: string, endDate?: string): string {
  if (!startDate) return "";

  const start = new Date(startDate).getFullYear();
  const end = endDate ? new Date(endDate).getFullYear() : "Present";

  return `${start}–${end}`;
}

export function formatDateRange(startDate: string, endDate?: string): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return `${start}–${end}`;
}

export function formatLocation(
  city?: string,
  region?: string,
  countryCode?: string
): string {
  const parts = [city, region, countryCode].filter(Boolean);
  return parts.join(", ");
}

export function formatUrl(url?: string): string {
  if (!url) return "";
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

export function beautifyLink(url: string): React.ReactNode {
  const cleanUrl = url.trim().replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");
  const withoutTrailingSlash = cleanUrl.endsWith("/")
    ? cleanUrl.slice(0, -1)
    : cleanUrl;
  const parts = withoutTrailingSlash.split("/");

  return (
    <>
      <strong>{parts[0]}</strong>
      {parts.length > 1 && "/" + parts.slice(1).join("/")}
    </>
  );
}

export function sortByDate<T extends { startDate: string; endDate?: string }>(
  items: T[],
  direction: "asc" | "desc" = "desc"
): T[] {
  return [...items].sort((a, b) => {
    const aDate = a.endDate || new Date().toISOString();
    const bDate = b.endDate || new Date().toISOString();
    return direction === "desc"
      ? new Date(bDate).getTime() - new Date(aDate).getTime()
      : new Date(aDate).getTime() - new Date(bDate).getTime();
  });
}
