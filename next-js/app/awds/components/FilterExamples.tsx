"use client";

import { useState } from "react";
import { Filters } from "@music/components/Filters";
import { useFilters } from "@/app/music/hooks/useFilters";

const DEFAULT_FILTERS: Record<string, string> = {
  group: "gvo",
  season: "2023-2024",
};

const LIMITED_FILTERS: Record<string, string> = {
  season: "current",
};

export function FilterExamples() {
  const [defaultFilters, setDefaultFilters] =
    useState<Record<string, string>>(DEFAULT_FILTERS);
  const [limitedFilters, setLimitedFilters] =
    useState<Record<string, string>>(LIMITED_FILTERS);

  const { handleChange: handleChangeDefault } = useFilters({
    initialFilters: defaultFilters,
    onFiltersChange: setDefaultFilters,
    updateUrl: false,
  });

  const { handleChange: handleChangeLimited } = useFilters({
    initialFilters: limitedFilters,
    onFiltersChange: setLimitedFilters,
    updateUrl: false,
  });

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
            onFiltersChange={handleChangeDefault as any}
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
            onFiltersChange={handleChangeLimited as any}
          />
        </div>
      </div>
    </>
  );
}
