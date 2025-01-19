"use client";

import { ListItem } from "@music/components/ListItem";
import { Sort } from "./Sort";
import { useSorting, SortType } from "@music/hooks/useSorting";

interface IndexPageProps {
  title: string;
  items: Array<{
    slug: string;
    title: string;
    href: string;
    stats: string[];
    sortableFields?: {
      [key in SortType]?: any;
    };
  }>;
  defaultSort?: SortType;
}

export function IndexPage({ title, items, defaultSort }: IndexPageProps) {
  const { sortedItems, currentSort, handleSort, sortOptions } = useSorting({
    items,
    defaultSort,
  });

  return (
    <div>
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        {sortOptions.length > 1 && (
          <Sort
            options={sortOptions}
            value={currentSort}
            onChange={handleSort}
          />
        )}
      </div>

      <div className="grid gap-4">
        {sortedItems.map((item) => (
          <ListItem
            key={item.slug}
            title={item.title}
            href={item.href}
            stats={item.stats}
          />
        ))}
      </div>
    </div>
  );
}
