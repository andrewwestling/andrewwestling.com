import database from "@music/data/database";
import { routes } from "@music/lib/routes";
import { IndexPage } from "@music/components/IndexPage";

export default function ConductorsPage() {
  const items = database.conductor.map((conductor) => ({
    slug: conductor.slug,
    title: conductor.title,
    href: routes.conductors.show(conductor.slug),
    stats: [
      `${conductor.concertCount} concert${
        conductor.concertCount !== 1 ? "s" : ""
      }`,
    ],
    sortableFields: {
      concerts: conductor.concertCount,
    },
  }));

  return <IndexPage title="Conductors" items={items} />;
}
