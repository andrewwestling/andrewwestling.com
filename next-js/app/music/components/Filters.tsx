"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Select, { StylesConfig } from "react-select";
import database from "@music/data/database";
import { getCurrentSeasonSlug, resolveSeasonSlug } from "@music/lib/helpers";

export type FilterFacetId = "group" | "season" | "conductor" | "venue";

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface SelectOption {
  label: string;
  value: string;
  type: FilterFacetId;
  count?: number;
}

interface GroupedOption {
  label: string;
  options: SelectOption[];
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

const selectStyles: StylesConfig<SelectOption, true> = {
  control: (base) => ({
    ...base,
    minHeight: "40px",
    height: "40px",
    backgroundColor: "rgb(249 250 251)",
    borderColor: "rgb(209 213 219)",
    minWidth: "300px",
  }),
  option: (base, state) => ({
    ...base,
    padding: "8px 12px",
    fontSize: "0.875rem",
    color: state.isSelected ? "white" : "rgb(17 24 39)",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 12px",
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: "0.875rem",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "rgb(243 244 246)",
  }),
  groupHeading: (base) => ({
    ...base,
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "rgb(107 114 128)",
    padding: "8px 12px",
    textTransform: "none",
  }),
};

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
      const seasonSlug = resolveSeasonSlug(
        searchParams.get("season")!,
        database.season
      );
      if (seasonSlug) {
        const season = database.season.find((s) => s.slug === seasonSlug);
        if (season) {
          concerts = concerts.filter(
            (concert) => concert.frontmatter.season === season.title
          );
        }
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
        options: [
          {
            label: "Current Season",
            value: "current",
            count: getCurrentSeasonSlug(database.season) ? undefined : 0,
          },
          ...database.season
            .filter((season) => {
              if (searchParams.get("season") === season.slug) return true;
              return usedSeasons.has(season.title);
            })
            .sort((a, b) => b.title.localeCompare(a.title))
            .map((season) => ({
              label: season.title,
              value: season.slug,
              count: filteredConcerts.filter(
                (c) => c.frontmatter.season === season.title
              ).length,
            })),
        ],
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

  const formatOptionLabel = ({ label, count, type }: SelectOption) => (
    <div className="flex justify-between">
      <span>{label}</span>
      {count !== undefined && (
        <span className="text-gray-500 ml-2">({count})</span>
      )}
    </div>
  );

  const options: GroupedOption[] = activeFacets.map((facet) => ({
    label: facet.label + "s",
    options: facet.options.map((opt) => ({
      ...opt,
      type: facet.id,
      value: `${facet.id}:${opt.value}`,
    })),
  }));

  const selectedValues = activeFacets
    .map((facet) => {
      const value = searchParams.get(facet.id);
      if (!value) return null;
      const option = facet.options.find((opt) => opt.value === value);
      if (!option) return null;
      return {
        ...option,
        type: facet.id,
        value: `${facet.id}:${option.value}`,
      };
    })
    .filter((v): v is SelectOption => v !== null);

  const handleChange = (newValue: readonly SelectOption[]) => {
    const params = new URLSearchParams(searchParams);

    // Clear all existing filter params
    facets.forEach((facet) => params.delete(facet));

    // Add new filter params
    newValue.forEach((option) => {
      const [type, value] = option.value.split(":");
      if (type === "season" && value === "current") {
        const currentSeasonSlug = getCurrentSeasonSlug(database.season);
        if (currentSeasonSlug) {
          params.set(type, currentSeasonSlug);
        }
      } else {
        params.set(type, value);
      }
    });

    router.push(`${pathname}?${params.toString()}`);

    if (onFiltersChange) {
      const filters: Record<string, string> = {};
      params.forEach((value, key) => {
        filters[key] = value;
      });
      onFiltersChange(filters);
    }
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Filters</label>
          <Select
            isMulti
            value={selectedValues}
            onChange={(newValue) => handleChange(newValue as SelectOption[])}
            options={options}
            formatOptionLabel={formatOptionLabel}
            styles={selectStyles}
            placeholder="Select filters..."
            isClearable={true}
            isSearchable={true}
          />
        </div>
      </div>
    </div>
  );
}
