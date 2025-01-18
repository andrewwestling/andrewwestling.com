import database from "@music/data/database";
import { routes } from "@music/lib/routes";
import { IndexPage } from "@music/components/IndexPage";

export default function GroupsPage() {
  const items = database.group.map((group) => {
    // Find all concerts for this group
    const concerts = database.concert.filter(
      (c) => c.frontmatter.group === group.title
    );

    return {
      slug: group.slug,
      title: group.title,
      href: routes.groups.show(group.slug),
      stats: [
        group.frontmatter.location,
        `${concerts.length} concert${concerts.length !== 1 ? "s" : ""}`,
      ].filter((stat): stat is string => stat !== undefined),
    };
  });

  return <IndexPage title="Groups" items={items} />;
}
