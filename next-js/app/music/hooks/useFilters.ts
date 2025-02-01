import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getCurrentSeasonSlug, resolveSeasonSlug } from "@music/lib/helpers";
import type { FilterFacetId } from "@music/components/Filters";
import { getConcerts } from "@music/data/queries/concerts";
import { getGroups, getGroupBySlug } from "@music/data/queries/groups";
import { getSeasons, getSeasonBySlug } from "@music/data/queries/seasons";
import {
  getConductors,
  getConductorBySlug,
} from "@music/data/queries/conductors";
import { getVenues, getVenueBySlug } from "@music/data/queries/venues";
import { getComposers, getComposerBySlug } from "@music/data/queries/composers";
import { getWorks, getWorksByComposer } from "@music/data/queries/works";

export function useFilters({
  facets = ["group", "season", "conductor", "venue", "composer"],
  updateUrl = true,
  initialFilters = {},
  onFiltersChange,
  customCounts,
}: {
  facets?: FilterFacetId[];
  updateUrl?: boolean;
  initialFilters?: Record<string, string>;
  onFiltersChange?: (filters: Record<string, string>) => void;
  customCounts?: Record<string, Record<string, number>>;
} = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get filtered concerts based on current filters
  const filteredConcerts = useMemo(() => {
    let concerts = [...getConcerts()];
    const params = updateUrl
      ? searchParams
      : new URLSearchParams(initialFilters);

    // Apply each active filter
    if (params.get("group")) {
      const group = getGroupBySlug(params.get("group")!);
      if (group) {
        concerts = concerts.filter(
          (concert) => concert.frontmatter.group === group.title
        );
      }
    }

    if (params.get("season")) {
      const seasonSlug = resolveSeasonSlug(params.get("season")!);
      if (seasonSlug) {
        const season = getSeasonBySlug(seasonSlug);
        if (season) {
          concerts = concerts.filter(
            (concert) => concert.frontmatter.season === season.title
          );
        }
      }
    }

    if (params.get("conductor")) {
      const conductor = getConductorBySlug(params.get("conductor")!);
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
      const venue = getVenueBySlug(params.get("venue")!);
      if (venue) {
        concerts = concerts.filter(
          (concert) => concert.frontmatter.venue === venue.title
        );
      }
    }

    if (params.get("composer")) {
      const composer = getComposerBySlug(params.get("composer")!);
      if (composer) {
        concerts = concerts.filter((concert) => {
          const works = concert.frontmatter.works
            ? Array.isArray(concert.frontmatter.works)
              ? concert.frontmatter.works
              : [concert.frontmatter.works]
            : [];

          // Find works by this composer
          const composerWorks = getWorksByComposer(composer.title);

          // Check if any of the composer's works are in this concert
          return composerWorks.some((work) => works.includes(work.title));
        });
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

    // Check if we're using only a single facet
    const isSingleFacet = facets.length === 1;

    const getDefaultCount = (facetId: FilterFacetId, value: string) => {
      switch (facetId) {
        case "season":
          return filteredConcerts.filter((c) => c.frontmatter.season === value)
            .length;
        case "group":
          return filteredConcerts.filter((c) => c.frontmatter.group === value)
            .length;
        case "conductor":
          return filteredConcerts.filter((c) => {
            const conductors = Array.isArray(c.frontmatter.conductor)
              ? c.frontmatter.conductor
              : [c.frontmatter.conductor];
            return conductors.includes(value);
          }).length;
        case "venue":
          return filteredConcerts.filter((c) => c.frontmatter.venue === value)
            .length;
        case "composer":
          return filteredConcerts.filter((concert) => {
            const works = concert.frontmatter.works
              ? Array.isArray(concert.frontmatter.works)
                ? concert.frontmatter.works
                : [concert.frontmatter.works]
              : [];

            // Find works by this composer
            const composerWorks = getWorksByComposer(value);

            // Check if any of the composer's works are in this concert
            return composerWorks.some((work) => works.includes(work.title));
          }).length;
        default:
          return 0;
      }
    };

    const getCount = (facetId: FilterFacetId, value: string) => {
      if (customCounts?.[facetId]?.[value] !== undefined) {
        return customCounts[facetId][value];
      }
      return getDefaultCount(facetId, value);
    };

    return [
      {
        id: "season",
        label: "Season",
        options: [
          ...getSeasons()
            .filter((season) => {
              if (isSingleFacet && facets[0] === "season") return true;
              if (params.get("season") === season.slug) return true;
              return usedSeasons.has(season.title);
            })
            .sort((a, b) => b.title.localeCompare(a.title))
            .map((season) => ({
              label: season.title,
              value: season.slug,
              count: getCount("season", season.title),
            })),
        ],
      },
      {
        id: "group",
        label: "Group",
        options: getGroups()
          .filter((group) => {
            if (isSingleFacet && facets[0] === "group") return true;
            if (params.get("group") === group.slug) return true;
            return usedGroups.has(group.title);
          })
          .map((group) => ({
            label: group.title,
            value: group.slug,
            count: getCount("group", group.title),
          })),
      },
      {
        id: "conductor",
        label: "Conductor",
        options: getConductors()
          .filter((conductor) => {
            if (isSingleFacet && facets[0] === "conductor") return true;
            if (params.get("conductor") === conductor.slug) return true;
            return usedConductors.has(conductor.title);
          })
          .map((conductor) => ({
            label: conductor.title,
            value: conductor.slug,
            count: getCount("conductor", conductor.title),
          })),
      },
      {
        id: "venue",
        label: "Venue",
        options: getVenues()
          .filter((venue) => {
            if (isSingleFacet && facets[0] === "venue") return true;
            if (params.get("venue") === venue.slug) return true;
            return usedVenues.has(venue.title);
          })
          .map((venue) => ({
            label: venue.title,
            value: venue.slug,
            count: getCount("venue", venue.title),
          })),
      },
      {
        id: "composer",
        label: "Composer",
        options: getComposers()
          .filter((composer) => {
            if (isSingleFacet && facets[0] === "composer") return true;
            if (params.get("composer") === composer.slug) return true;

            // Only check for works if not in single facet mode
            if (!isSingleFacet) {
              // Find works by this composer
              const composerWorks = getWorksByComposer(composer.title);

              // Check if any of the composer's works are in the filtered concerts
              return composerWorks.some((work) =>
                filteredConcerts.some((concert) => {
                  const works = concert.frontmatter.works
                    ? Array.isArray(concert.frontmatter.works)
                      ? concert.frontmatter.works
                      : [concert.frontmatter.works]
                    : [];
                  return works.includes(work.title);
                })
              );
            }

            return true;
          })
          .map((composer) => ({
            label: composer.title,
            value: composer.slug,
            count: getCount("composer", composer.title),
          })),
      },
    ];
  }, [
    filteredConcerts,
    facets,
    searchParams,
    updateUrl,
    initialFilters,
    customCounts,
  ]);

  const handleChange = (newValue: readonly any[] | any) => {
    const params = new URLSearchParams(
      updateUrl ? searchParams.toString() : initialFilters
    );

    // Clear all existing filter params
    facets.forEach((facet) => params.delete(facet));

    // Handle both array and single object values
    const values = Array.isArray(newValue) ? newValue : [newValue];

    // Only process values that have a valid value property
    values.forEach((option) => {
      if (option?.value) {
        const [type, value] = option.value.split(":");
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
