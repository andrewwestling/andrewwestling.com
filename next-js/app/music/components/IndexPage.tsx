"use client";

import { ListItem } from "@music/components/ListItem";
import { useSorting, SortType } from "@music/hooks/useSorting";

import { Filters, FilterFacetId } from "./Filters";
import { PageTitle } from "./PageTitle";
import { Sort } from "./Sort";

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
    className?: string;
    titleBadges?: React.ReactNode[];
    statsBadges?: React.ReactNode[];
  }>;
  defaultSort?: SortType;
  showFilters?: boolean;
  facets?: FilterFacetId[];
  initialFilters?: Record<string, string>;
  onFiltersChange?: (filters: Record<string, string>) => void;
  updateUrl?: boolean;
  customCounts?: Record<string, Record<string, number>>;
}

export function IndexPage({
  title,
  items,
  defaultSort,
  showFilters = false,
  facets = ["group", "season", "conductor", "venue", "composer"],
  initialFilters = {},
  onFiltersChange,
  updateUrl = true,
  customCounts,
}: IndexPageProps) {
  const { sortedItems, currentSort, handleSort, sortOptions } = useSorting({
    items,
    defaultSort,
  });

  return (
    <div>
      <div className="flex flex-col gap-1 mb-6">
        {title && <PageTitle>{title}</PageTitle>}
        {sortOptions.length >= 1 && (
          <Sort
            options={sortOptions}
            value={currentSort}
            onChange={handleSort}
          />
        )}
      </div>

      {showFilters && (
        <Filters
          facets={facets}
          initialFilters={initialFilters}
          onFiltersChange={onFiltersChange}
          updateUrl={updateUrl}
          customCounts={customCounts}
        />
      )}

      <div className="grid gap-4">
        {sortedItems.map((item) => (
          <ListItem
            key={item.slug}
            title={item.title}
            href={item.href}
            stats={item.stats}
            titleBadges={item.titleBadges}
            statsBadges={item.statsBadges}
            className={item.className}
          />
        ))}
      </div>
    </div>
  );
}
