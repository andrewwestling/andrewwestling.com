"use client";

import { useState } from "react";
import { Filters } from "@music/components/Filters";
import { ComponentWrapper } from "./ComponentWrapper";
import { Button } from "@components/Button";

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

  return (
    <ComponentWrapper>
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
      </div>
      <div>
        <Button
          onClick={() => {
            setDefaultFilters(DEFAULT_FILTERS);
            setLimitedFilters(LIMITED_FILTERS);
          }}
        >
          Reset
        </Button>
      </div>
    </ComponentWrapper>
  );
}
