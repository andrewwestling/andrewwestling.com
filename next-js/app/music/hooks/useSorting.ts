import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export type SortType =
  | "alphabetical"
  | "composer"
  | "concerts"
  | "works"
  | "year";

export interface SortOption {
  label: string;
  value: SortType;
}

const SORT_LABELS: Record<SortType, string> = {
  alphabetical: "alphabetically",
  composer: "by composer name",
  concerts: "by concert count",
  works: "by work count",
  year: "by year",
};

interface UseSortingOptions {
  items: any[];
  defaultSort?: SortType;
}

export function useSorting({
  items,
  defaultSort = "alphabetical",
}: UseSortingOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const availableSortOptions = useMemo(() => {
    // Determine from sortableFields
    const sortTypes = new Set<SortType>(["alphabetical"]);

    // Look at first item's sortableFields to determine available sorts
    if (items.length > 0 && items[0].sortableFields) {
      Object.keys(items[0].sortableFields).forEach((key) => {
        if (key in SORT_LABELS) {
          sortTypes.add(key as SortType);
        }
      });
    }

    return Array.from(sortTypes).map((value) => ({
      value,
      label: SORT_LABELS[value],
    }));
  }, [items]);

  const currentSort = (searchParams.get("sort") as SortType) || defaultSort;
  const currentSortOption = availableSortOptions.find(
    (opt) => opt.value === currentSort
  );

  const sortedItems = useMemo(() => {
    if (!currentSortOption) return items;

    return [...items].sort((a, b) => {
      switch (currentSortOption.value) {
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return (
            (b.sortableFields?.[currentSortOption.value] ?? 0) -
            (a.sortableFields?.[currentSortOption.value] ?? 0)
          );
      }
    });
  }, [items, currentSortOption]);

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === defaultSort) {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    const newSearch = params.toString();
    const newUrl = newSearch ? `${pathname}?${newSearch}` : pathname;
    router.push(newUrl);
  };

  return {
    sortedItems,
    currentSort,
    handleSort,
    sortOptions: availableSortOptions,
  };
}
