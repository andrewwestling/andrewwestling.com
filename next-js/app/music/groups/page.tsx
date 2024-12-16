import database from "@music/data/database";
import { routes } from "@music/lib/routes";
import { ListItem } from "@music/components/ListItem";

export default function GroupsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Groups</h1>

      <div className="grid gap-4">
        {database.group.map((group) => {
          // Find all concerts for this group
          const concerts = database.concert.filter(
            (c) => c.frontmatter.group === group.title
          );

          return (
            <ListItem
              key={group.slug}
              title={group.title}
              href={routes.groups.show(group.slug)}
              stats={[
                group.frontmatter.location,
                `${concerts.length} concert${concerts.length !== 1 ? "s" : ""}`,
              ]}
            />
          );
        })}
      </div>
    </div>
  );
}
