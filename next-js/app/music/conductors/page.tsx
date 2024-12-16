import database from "@music/data/database";
import { routes } from "@music/lib/routes";
import { ListItem } from "@music/components/ListItem";

export default function ConductorsPage() {
  // Sort conductors by concert count
  const sortedConductors = [...database.conductor].sort(
    (a, b) => b.concertCount - a.concertCount
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Conductors</h1>

      <div className="grid gap-4">
        {sortedConductors.map((conductor) => (
          <ListItem
            key={conductor.slug}
            title={conductor.title}
            href={routes.conductors.show(conductor.slug)}
            stats={[
              `${conductor.concertCount} concert${
                conductor.concertCount !== 1 ? "s" : ""
              }`,
            ]}
          />
        ))}
      </div>
    </div>
  );
}
