import Link from "next/link";
import database from "@music/data/database";
import { routes } from "@music/lib/routes";

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
          <div key={conductor.slug}>
            <Link href={routes.conductors.show(conductor.slug)}>
              {conductor.title}
            </Link>
            <span className="text-muted ml-2">
              ({conductor.concertCount} concert
              {conductor.concertCount !== 1 ? "s" : ""})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
