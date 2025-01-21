import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import database from "@music/data/database";
import { getCurrentSeasonSlug, resolveSeasonSlug } from "@music/lib/helpers";
import type { FilterFacetId } from "@music/components/Filters";

export function useFilters({
  facets = ["group", "season", "conductor", "venue", "composer"],
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

    // Add composer filtering
    if (params.get("composer")) {
      const composer = database.composer.find(
        (c) => c.slug === params.get("composer")
      );
      if (composer) {
        concerts = concerts.filter((concert) => {
          const works = concert.frontmatter.works
            ? Array.isArray(concert.frontmatter.works)
              ? concert.frontmatter.works
              : [concert.frontmatter.works]
            : [];

          // Find works by this composer in the concert
          const composerWorks = database.work.filter(
            (work) => work.frontmatter.composer === composer.title
          );

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

    return [
      {
        id: "season",
        label: "Season",
        options: [
          ...database.season
            .filter((season) => {
              if (isSingleFacet && facets[0] === "season") return true;
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
            if (isSingleFacet && facets[0] === "group") return true;
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
            if (isSingleFacet && facets[0] === "conductor") return true;
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
            if (isSingleFacet && facets[0] === "venue") return true;
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
      {
        id: "composer",
        label: "Composer",
        options: database.composer
          .filter((composer) => {
            if (isSingleFacet && facets[0] === "composer") return true;
            if (params.get("composer") === composer.slug) return true;

            // Only check for works if not in single facet mode
            if (!isSingleFacet) {
              // Find works by this composer
              const composerWorks = database.work.filter(
                (work) => work.frontmatter.composer === composer.title
              );

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
            count: filteredConcerts.filter((concert) => {
              const works = concert.frontmatter.works
                ? Array.isArray(concert.frontmatter.works)
                  ? concert.frontmatter.works
                  : [concert.frontmatter.works]
                : [];

              // Find works by this composer
              const composerWorks = database.work.filter(
                (work) => work.frontmatter.composer === composer.title
              );

              // Check if any of the composer's works are in this concert
              return composerWorks.some((work) => works.includes(work.title));
            }).length,
          })),
      },
    ];
  }, [filteredConcerts, searchParams, updateUrl, initialFilters, facets]);

  const handleChange = (newValue: readonly any[]) => {
    const params = new URLSearchParams(
      updateUrl ? searchParams : initialFilters
    );

    // Clear all existing filter params
    facets.forEach((facet) => params.delete(facet));

    // Add new filter params
    newValue.forEach((option) => {
      const [type, value] = option.value.split(":");
      params.set(type, value);
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
