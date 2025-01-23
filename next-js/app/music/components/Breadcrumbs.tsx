"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@music/lib/routes";
import { formatDate } from "../lib/helpers";
import { getConcertBySlug } from "@music/data/queries/concerts";
import { getWorkBySlug } from "@music/data/queries/works";
import { getComposerBySlug } from "@music/data/queries/composers";
import { getConductorBySlug } from "@music/data/queries/conductors";
import { getGroupBySlug } from "@music/data/queries/groups";
import { getVenueBySlug } from "@music/data/queries/venues";
import { getSeasonBySlug } from "@music/data/queries/seasons";

interface BreadcrumbsProps {
  path?: string;
}

export function Breadcrumbs({ path }: BreadcrumbsProps) {
  const pathname = usePathname();
  const segments = (path || pathname).split("/").filter(Boolean);

  // Don't show anything on the homepage
  if (segments.length <= 1) {
    return null;
  }

  // Always start with Music
  const crumbs: { label: string; href: string }[] = [
    { label: "Music", href: routes.home() },
  ];

  // Build the rest of the breadcrumbs based on the path
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];

    // Handle index pages
    if (i === 1) {
      const section = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      crumbs.push({
        label: section,
        href: `${routes.home()}/${segment}`,
      });
      continue;
    }

    // Handle detail pages
    const parentSection = segments[i - 1];
    const slug = segment;
    let label = slug;

    // Look up the proper title based on the section
    switch (parentSection) {
      case "concerts":
        const concert = getConcertBySlug(slug);
        if (concert) label = formatDate(concert.frontmatter.date);
        break;
      case "works":
        const work = getWorkBySlug(slug);
        if (work) label = work.title;
        break;
      case "composers":
        const composer = getComposerBySlug(slug);
        if (composer) label = composer.title;
        break;
      case "conductors":
        const conductor = getConductorBySlug(slug);
        if (conductor) label = conductor.title;
        break;
      case "groups":
        const group = getGroupBySlug(slug);
        if (group) label = group.title;
        break;
      case "venues":
        const venue = getVenueBySlug(slug);
        if (venue) label = venue.title;
        break;
      case "seasons":
        const season = getSeasonBySlug(slug);
        if (season) label = season.title;
        break;
    }

    crumbs.push({
      label,
      href: `${routes.home()}/${segments.slice(1, i + 1).join("/")}`,
    });
  }

  return (
    <nav className="py-4 text-sm">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href}>
          {i > 0 && <span className="mx-2 text-muted">›</span>}
          {i === crumbs.length - 1 ? (
            <span className="font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href}>{crumb.label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}
