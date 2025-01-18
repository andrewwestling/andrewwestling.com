"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@music/lib/routes";
import database from "@music/data/database";

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
      const section = segment.charAt(0).toUpperCase() + segment.slice(1);
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
        const concert = database.concert.find((c) => c.slug === slug);
        if (concert) label = concert.title;
        break;
      case "works":
        const work = database.work.find((w) => w.slug === slug);
        if (work) label = work.title;
        break;
      case "composers":
        const composer = database.composer.find((c) => c.slug === slug);
        if (composer) label = composer.title;
        break;
      case "conductors":
        const conductor = database.conductor.find((c) => c.slug === slug);
        if (conductor) label = conductor.title;
        break;
      case "groups":
        const group = database.group.find((g) => g.slug === slug);
        if (group) label = group.title;
        break;
      case "venues":
        const venue = database.venue.find((v) => v.slug === slug);
        if (venue) label = venue.title;
        break;
      case "seasons":
        const season = database.season.find((s) => s.slug === slug);
        if (season) label = season.title;
        break;
    }

    crumbs.push({
      label,
      href: `${routes.home()}/${segments.slice(1, i + 1).join("/")}`,
    });
  }

  return (
    <nav className="text-sm">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href}>
          {i > 0 && <span className="mx-2 text-muted">›</span>}
          {i === crumbs.length - 1 ? (
            <span className="font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="text-muted hover:text-text">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
