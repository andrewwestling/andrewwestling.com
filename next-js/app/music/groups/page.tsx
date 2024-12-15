import Link from "next/link";
import database from "@music/data/database";
import { routes } from "@music/lib/routes";

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
            <div key={group.slug}>
              <Link href={routes.groups.show(group.slug)}>{group.title}</Link>
              <span className="text-muted ml-2">
                {group.frontmatter.location}
                {concerts.length > 0 && (
                  <>
                    {" "}
                    • {concerts.length} concert
                    {concerts.length !== 1 ? "s" : ""}
                  </>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
