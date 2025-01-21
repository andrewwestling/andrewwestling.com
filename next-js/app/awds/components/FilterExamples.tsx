"use client";

import { useState } from "react";
import { Filters } from "@music/components/Filters";

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
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs text-muted">All facets (default)</label>
          </div>
          <div className="text-xs text-muted mb-2">
            Selected: <code>{JSON.stringify(defaultFilters)}</code>
          </div>
          <Filters
            updateUrl={false}
            initialFilters={defaultFilters}
            onFiltersChange={setDefaultFilters}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs text-muted">
              Limited facets: Group and Season Only
            </label>
          </div>
          <div className="text-xs text-muted mb-2">
            Selected: <code>{JSON.stringify(limitedFilters)}</code>
          </div>
          <Filters
            facets={["group", "season"]}
            updateUrl={false}
            initialFilters={limitedFilters}
            onFiltersChange={setLimitedFilters}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs text-muted">
              Single facet: Composer Only (shows all options)
            </label>
          </div>
          <div className="text-xs text-muted mb-2">
            Selected: <code>{JSON.stringify(singleFacetFilters)}</code>
          </div>
          <Filters
            facets={["composer"]}
            updateUrl={false}
            initialFilters={singleFacetFilters}
            onFiltersChange={setSingleFacetFilters}
          />
        </div>
      </div>
    </>
  );
}
