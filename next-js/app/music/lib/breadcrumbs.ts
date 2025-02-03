import { routes } from "./routes";
import { formatDate } from "./helpers";
import { getConcertBySlug } from "@music/data/queries/concerts";
import { getWorkBySlug } from "@music/data/queries/works";
import { getComposerBySlug } from "@music/data/queries/composers";
import { getConductorBySlug } from "@music/data/queries/conductors";
import { getGroupBySlug } from "@music/data/queries/groups";
import { getVenueBySlug } from "@music/data/queries/venues";
import { getSeasonBySlug } from "@music/data/queries/seasons";
import type { Crumb } from "@breadcrumbs/default";

export function getMusicBreadcrumbs(segments: string[]): Crumb[] {
  const crumbs: Crumb[] = [{ label: "Music Library", href: routes.home() }];

  // If we're not on the music home page, add additional crumbs
  if (segments.length > 1) {
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
  }

  return crumbs;
}
