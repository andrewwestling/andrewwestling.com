import { notFound } from "next/navigation";
import { PageProps } from "@music/lib/types";
import { routes } from "@music/lib/routes";
import { formatWorkTitle, formatComposerName } from "../../lib/helpers";
import { ListItem } from "../../components/ListItem";
import { getComposerBySlug } from "@music/data/queries/composers";
import { getWorksByComposer } from "@music/data/queries/works";

export default function ComposerPage({ params }: PageProps) {
  const composer = getComposerBySlug(decodeURIComponent(params.slug));

  if (!composer) {
    notFound();
  }

  // Find all works by this composer
  const works = getWorksByComposer(composer.title);

  return (
    <article className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">
          {formatComposerName(composer.title)}
        </h1>
      </div>
      {works.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Works</h2>
          <div className="grid gap-4">
            {works.map((work) => (
              <ListItem
                key={work.slug}
                title={formatWorkTitle(work)}
                href={routes.works.show(work.slug)}
                stats={[]}
                bucketList={work.bucketList}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
