import { Metadata } from "next";

import { IndexPage } from "@music/components/IndexPage";
import { getConductors } from "@music/data/queries";
import { routes } from "@music/lib/routes";

export const metadata: Metadata = {
  title: "Conductors",
  description: "Conductors I've worked with",
};

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
