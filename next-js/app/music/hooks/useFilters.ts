import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import database from "@music/data/database";
import { getCurrentSeasonSlug, resolveSeasonSlug } from "@music/lib/helpers";
import type { FilterFacetId } from "@music/components/Filters";

export function useFilters({
  facets = ["group", "season", "conductor", "venue"],
  updateUrl = true,
  initialFilters = {},
  onFiltersChange,
}: {
  facets?: FilterFacetId[];
  updateUrl?: boolean;
  initialFilters?: Record<string, string>;
  onFiltersChange?: (filters: Record<string, string>) => void;
} = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get filtered concerts based on current filters
  const filteredConcerts = useMemo(() => {
    let concerts = [...database.concert];
    const params = updateUrl
      ? searchParams
      : new URLSearchParams(initialFilters);

    // Apply each active filter
    if (params.get("group")) {
      const group = database.group.find((g) => g.slug === params.get("group"));
      if (group) {
        concerts = concerts.filter(
          (concert) => concert.frontmatter.group === group.title
        );
      }
    }

    if (params.get("season")) {
      const seasonSlug = resolveSeasonSlug(
        params.get("season")!,
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

    if (params.get("conductor")) {
      const conductor = database.conductor.find(
        (c) => c.slug === params.get("conductor")
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

    if (params.get("venue")) {
      const venue = database.venue.find((v) => v.slug === params.get("venue"));
      if (venue) {
        concerts = concerts.filter(
          (concert) => concert.frontmatter.venue === venue.title
        );
      }
    }

    return concerts;
  }, [searchParams, updateUrl, initialFilters]);

  // Generate facet options based on filtered concerts
  const availableFacets = useMemo(() => {
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

    const params = updateUrl
      ? searchParams
      : new URLSearchParams(initialFilters);

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
              if (params.get("season") === season.slug) return true;
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
            if (params.get("group") === group.slug) return true;
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
            if (params.get("conductor") === conductor.slug) return true;
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
            if (params.get("venue") === venue.slug) return true;
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
  }, [filteredConcerts, searchParams, updateUrl, initialFilters]);

  const handleChange = (newValue: readonly any[]) => {
    const params = new URLSearchParams(
      updateUrl ? searchParams : initialFilters
    );

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

    if (updateUrl) {
      router.push(`${pathname}?${params.toString()}`);
    }

    if (onFiltersChange) {
      const filters: Record<string, string> = {};
      params.forEach((value, key) => {
        filters[key] = value;
      });
      onFiltersChange(filters);
    }
  };

  return {
    filteredConcerts,
    availableFacets,
    handleChange,
  };
}
