"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import database from "@music/data/database";

export type FilterFacetId = "group" | "season" | "conductor" | "venue";

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterFacet {
  id: FilterFacetId;
  label: string;
  options: FilterOption[];
}

interface FiltersProps {
  facets?: FilterFacetId[];
  onFiltersChange?: (filters: Record<string, string>) => void;
}

export function Filters({
  facets = ["group", "season", "conductor", "venue"],
  onFiltersChange,
}: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get filtered concerts based on current filters
  const filteredConcerts = useMemo(() => {
    let concerts = [...database.concert];

    // Apply each active filter
    if (searchParams.get("group")) {
      const group = database.group.find(
        (g) => g.slug === searchParams.get("group")
      );
      if (group) {
        concerts = concerts.filter(
          (concert) => concert.frontmatter.group === group.title
        );
      }
    }

    if (searchParams.get("season")) {
      const season = database.season.find(
        (s) => s.slug === searchParams.get("season")
      );
      if (season) {
        concerts = concerts.filter(
          (concert) => concert.frontmatter.season === season.title
        );
      }
    }

    if (searchParams.get("conductor")) {
      const conductor = database.conductor.find(
        (c) => c.slug === searchParams.get("conductor")
      );
      if (conductor) {
        concerts = concerts.filter((concert) => {
          const conductors = Array.isArray(concert.frontmatter.conductor)
            ? concert.frontmatter.conductor
            : [concert.frontmatter.conductor];
          return conductors.includes(conductor.title);
        });
      }
    }

    if (searchParams.get("venue")) {
      const venue = database.venue.find(
        (v) => v.slug === searchParams.get("venue")
      );
      if (venue) {
        concerts = concerts.filter(
          (concert) => concert.frontmatter.venue === venue.title
        );
      }
    }

    return concerts;
  }, [searchParams]);

  // Generate facet options based on filtered concerts
  const availableFacets: FilterFacet[] = useMemo(() => {
    // Get unique values from filtered concerts
    const usedGroups = new Set(
      filteredConcerts.map((c) => c.frontmatter.group)
    );
    const usedSeasons = new Set(
      filteredConcerts.map((c) => c.frontmatter.season)
    );
    const usedVenues = new Set(
      filteredConcerts.map((c) => c.frontmatter.venue)
    );
    const usedConductors = new Set(
      filteredConcerts.flatMap((c) =>
        Array.isArray(c.frontmatter.conductor)
          ? c.frontmatter.conductor
          : [c.frontmatter.conductor]
      )
    );

    return [
      {
        id: "season",
        label: "Season",
        options: database.season
          .filter((season) => {
            if (searchParams.get("season") === season.slug) return true;
            return usedSeasons.has(season.title);
          })
          .sort((a, b) => b.title.localeCompare(a.title)) // Reverse sort
          .map((season) => ({
            label: season.title,
            value: season.slug,
            count: filteredConcerts.filter(
              (c) => c.frontmatter.season === season.title
            ).length,
          })),
      },
      {
        id: "group",
        label: "Group",
        options: database.group
          .filter((group) => {
            // Don't filter if this facet is currently selected
            if (searchParams.get("group") === group.slug) return true;
            return usedGroups.has(group.title);
          })
          .map((group) => ({
            label: group.title,
            value: group.slug,
            count: filteredConcerts.filter(
              (c) => c.frontmatter.group === group.title
            ).length,
          })),
      },
      {
        id: "conductor",
        label: "Conductor",
        options: database.conductor
          .filter((conductor) => {
            if (searchParams.get("conductor") === conductor.slug) return true;
            return usedConductors.has(conductor.title);
          })
          .map((conductor) => ({
            label: conductor.title,
            value: conductor.slug,
            count: filteredConcerts.filter((c) => {
              const conductors = Array.isArray(c.frontmatter.conductor)
                ? c.frontmatter.conductor
                : [c.frontmatter.conductor];
              return conductors.includes(conductor.title);
            }).length,
          })),
      },
      {
        id: "venue",
        label: "Venue",
        options: database.venue
          .filter((venue) => {
            if (searchParams.get("venue") === venue.slug) return true;
            return usedVenues.has(venue.title);
          })
          .map((venue) => ({
            label: venue.title,
            value: venue.slug,
            count: filteredConcerts.filter(
              (c) => c.frontmatter.venue === venue.title
            ).length,
          })),
      },
    ];
  }, [filteredConcerts, searchParams]);

  const activeFacets = availableFacets.filter((facet) =>
    facets.includes(facet.id)
  );

  const handleFilterChange = useCallback(
    (facetId: string, value: string) => {
      const params = new URLSearchParams(searchParams);

      if (value) {
        params.set(facetId, value);
      } else {
        params.delete(facetId);
      }

      // Update URL
      router.push(`${pathname}?${params.toString()}`);

      // Notify parent component
      if (onFiltersChange) {
        const filters: Record<string, string> = {};
        params.forEach((value, key) => {
          filters[key] = value;
        });
        onFiltersChange(filters);
      }
    },
    [pathname, router, searchParams, onFiltersChange]
  );

  const hasActiveFilters = Array.from(searchParams.keys()).some((key) =>
    facets.includes(key as FilterFacetId)
  );

  const handleClearAll = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    facets.forEach((facet) => params.delete(facet));
    router.push(`${pathname}?${params.toString()}`);

    if (onFiltersChange) {
      const remainingFilters: Record<string, string> = {};
      params.forEach((value, key) => {
        remainingFilters[key] = value;
      });
      onFiltersChange(remainingFilters);
    }
  }, [facets, pathname, router, searchParams, onFiltersChange]);

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-wrap items-end gap-4">
        {activeFacets.map((facet) => {
          const selectedValue = searchParams.get(facet.id);
          const selectedOption = selectedValue
            ? facet.options.find((opt) => opt.value === selectedValue)
            : null;

          return (
            <div key={facet.id} className="min-w-[200px]">
              <label className="block text-sm font-medium mb-1">
                {facet.label}
              </label>
              <div className="flex gap-2">
                {selectedOption ? (
                  <div className="flex-1 flex items-center h-10 rounded-md border border-gray-300 bg-gray-50 px-3">
                    <span className="flex-1">
                      {selectedOption.label}
                      {selectedOption.count !== undefined &&
                        ` (${selectedOption.count})`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleFilterChange(facet.id, "")}
                      className="text-sm text-gray-500 hover:text-gray-700"
                      title={`Clear ${facet.label} filter`}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 relative">
                    <select
                      className="w-full h-10 appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 pr-8"
                      value=""
                      onChange={(e) =>
                        handleFilterChange(facet.id, e.target.value)
                      }
                    >
                      <option value="">All {facet.label}s</option>
                      {facet.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                          {option.count !== undefined && ` (${option.count})`}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            className="flex h-10 items-center rounded-md border border-gray-300 bg-gray-50 px-3 text-sm gap-2"
          >
            <span className="text-gray-900">Clear all filters</span>
            <span className="text-gray-500 hover:text-gray-700">×</span>
          </button>
        )}
      </div>
    </div>
  );
}
