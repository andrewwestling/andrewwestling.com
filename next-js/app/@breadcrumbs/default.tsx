"use client";

import { usePathname } from "next/navigation";
import { Breadcrumbs } from "@components/Breadcrumbs";
import { getMusicBreadcrumbs } from "@music/lib/breadcrumbs";
import { getProjectsBreadcrumbs } from "@projects/breadcrumbs";

export interface Crumb {
  label: string;
  href: string;
  isHome?: boolean;
}

export default function BreadcrumbsSlot({ path }: { path: string }) {
  const pathname = usePathname();
  const segments = (path || pathname).split("/").filter(Boolean);

  // Always start with Home
  const crumbs: Crumb[] = [
    {
      label: "",
      href: "/",
      isHome: true,
    },
  ];

  if (segments[0] === "music") {
    // If we have a music segment, use special logic to generate crumbs
    crumbs.push(...getMusicBreadcrumbs(segments));
  } else if (segments[0] === "projects") {
    // If we have a projects segment, use special logic to generate crumbs
    crumbs.push(...getProjectsBreadcrumbs(segments));
  } else if (segments[0] === "awds") {
    // Also special case for AWDS page
    crumbs.push({
      label: "Andrew Westling Design System",
      href: "/awds",
    });
  } else {
    // For all other segments, just use the segment as-is; capitalize the first letter of each word
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      crumbs.push({
        label,
        href: `/${segments.slice(0, i + 1).join("/")}`,
      });
    }
  }

  return <Breadcrumbs path={path || pathname} crumbs={crumbs} />;
}
