import { routes } from "@music/lib/routes";
import { IndexPage } from "@music/components/IndexPage";
import { getConductors } from "@music/data/queries/conductors";

export default function ConductorsPage() {
  const conductors = getConductors();

  const items = conductors.map((conductor) => ({
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
