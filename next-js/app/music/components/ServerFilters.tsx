import { Suspense } from "react";
import { Filters } from "./Filters";
import type { FilterFacetId } from "./Filters";

interface ServerFiltersProps {
  facets?: FilterFacetId[];
}

export function ServerFilters({ facets }: ServerFiltersProps) {
  return (
    <Suspense>
      <Filters facets={facets} />
    </Suspense>
  );
}
