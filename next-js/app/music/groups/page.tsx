import { routes } from "@music/lib/routes";
import { IndexPage } from "@music/components/IndexPage";
import { getGroups } from "@music/data/queries/groups";
import { getConcertsByGroup } from "@music/data/queries/concerts";

export default function GroupsPage() {
  const groups = getGroups();

  const items = groups.map((group) => {
    // Find all concerts for this group
    const concerts = getConcertsByGroup(group.title);

    return {
      slug: group.slug,
      title: group.title,
      href: routes.groups.show(group.slug),
      stats: [
        group.frontmatter.location,
        `${concerts.length} concert${concerts.length !== 1 ? "s" : ""}`,
      ].filter((stat): stat is string => stat !== undefined),
      sortableFields: {
        concerts: concerts.length,
      },
    };
  });

  return <IndexPage title="Groups" items={items} />;
}
