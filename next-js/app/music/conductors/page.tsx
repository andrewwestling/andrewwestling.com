import database from "@music/data/database";
import { routes } from "@music/lib/routes";
import { IndexPage } from "@music/components/IndexPage";

export default function ConductorsPage() {
  // Sort conductors by concert count
  const sortedConductors = [...database.conductor].sort(
    (a, b) => b.concertCount - a.concertCount
  );

  const items = sortedConductors.map((conductor) => ({
    slug: conductor.slug,
    title: conductor.title,
    href: routes.conductors.show(conductor.slug),
    stats: [
      `${conductor.concertCount} concert${
        conductor.concertCount !== 1 ? "s" : ""
      }`,
    ],
  }));

  return <IndexPage title="Conductors" items={items} />;
}
