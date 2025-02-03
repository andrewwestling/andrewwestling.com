import { Crumb } from "../@breadcrumbs/default";

export function getProjectsBreadcrumbs(segments: string[]): Crumb[] {
  const crumbs: Crumb[] = [{ label: "Projects", href: "/projects" }];

  // If we're not on the projects home page, add additional crumbs
  if (segments.length > 1) {
    const projectSlug = segments[1];
    let label = projectSlug;

    /**
     * Labels for project names are hardcoded for now, but could be dynamic in the future, ideally via the page's metadata 'title'
     *
     * We can't do this because it requires dynamic imports and that means async, but can't do that with a "use client" etc
     */
    switch (projectSlug) {
      case "media-cube":
        label = "Media Cube";
        break;
      case "tidbyt":
        label = "Tidbyt Apps";
        break;
    }

    crumbs.push({
      label,
      href: `/projects/${projectSlug}`,
    });
  }

  return crumbs;
}
