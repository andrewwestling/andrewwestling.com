"use client";

import { useState } from "react";

import { Filters } from "@music/components/Filters";

import { VariantWrapper as Variant } from "./VariantWrapper";

const DEFAULT_FILTERS: Record<string, string> = {
  group: "gvo",
  season: "2023-2024",
};

const LIMITED_FILTERS: Record<string, string> = {
  season: "2021-2022",
};

const SINGLE_FACET_FILTERS: Record<string, string> = {
  composer: "mahler-gustav",
};

export function FilterExamples() {
  const [defaultFilters, setDefaultFilters] =
    useState<Record<string, string>>(DEFAULT_FILTERS);
  const [limitedFilters, setLimitedFilters] =
    useState<Record<string, string>>(LIMITED_FILTERS);
  const [singleFacetFilters, setSingleFacetFilters] =
    useState<Record<string, string>>(SINGLE_FACET_FILTERS);

  return (
    <>
      <div className="grid gap-4">
        <Variant
          label="All facets (default)"
          meta={
            <>
              Selected: <code>{JSON.stringify(defaultFilters)}</code>
            </>
          }
        >
          <Filters
            updateUrl={false}
            initialFilters={defaultFilters}
            onFiltersChange={setDefaultFilters}
          />
        </Variant>

        <Variant
          label="Limited facets: Group and Season Only"
          meta={
            <>
              Selected: <code>{JSON.stringify(limitedFilters)}</code>
            </>
          }
        >
          <Filters
            facets={["group", "season"]}
            updateUrl={false}
            initialFilters={limitedFilters}
            onFiltersChange={setLimitedFilters}
          />
        </Variant>

        <Variant
          label="Single facet: Composer Only (shows all options)"
          meta={
            <>
              Selected: <code>{JSON.stringify(singleFacetFilters)}</code>
            </>
          }
        >
          <Filters
            facets={["composer"]}
            updateUrl={false}
            initialFilters={singleFacetFilters}
            onFiltersChange={setSingleFacetFilters}
          />
        </Variant>
      </div>
    </>
  );
}
