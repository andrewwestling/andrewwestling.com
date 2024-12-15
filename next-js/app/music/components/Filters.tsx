"use client";

import { useSearchParams } from "next/navigation";
import Select, { StylesConfig } from "react-select";
import { useFilters } from "@music/hooks/useFilters";

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

export interface FiltersProps {
  facets?: FilterFacetId[];
  updateUrl?: boolean;
  initialFilters?: Record<string, string>;
  onFiltersChange?: (filters: Record<string, string>) => void;
}

const selectStyles: StylesConfig<SelectOption, true> = {
  control: (base, state) => ({
    ...base,
    minHeight: "40px",
    backgroundColor: "var(--color-surface)",
    borderColor: "var(--color-border)",
    minWidth: "300px",
    boxShadow: state.isFocused ? "0 0 0 1px var(--color-selected)" : "none",
    "&:hover": {
      borderColor: "var(--color-selected)",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--color-surface)",
    borderColor: "var(--color-border)",
  }),
  option: (base, state) => ({
    ...base,
    padding: "8px 12px",
    fontSize: "0.875rem",
    color: state.isSelected ? "white" : "var(--color-text)",
    backgroundColor: state.isSelected
      ? "var(--color-selected)"
      : state.isFocused
      ? "var(--color-highlight)"
      : "var(--color-surface)",
    "&:active": {
      backgroundColor: "var(--color-selected)",
      color: "black",
    },
  }),
  input: (base) => ({
    ...base,
    color: "var(--color-text)",
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: "0.875rem",
    color: "var(--color-muted)",
  }),
  singleValue: (base) => ({
    ...base,
    color: "var(--color-text)",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "var(--color-highlight)",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "var(--color-text)",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "var(--color-muted)",
    "&:hover": {
      backgroundColor: "var(--color-selected)",
      color: "black",
    },
  }),
  groupHeading: (base) => ({
    ...base,
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "var(--color-muted)",
    backgroundColor: "var(--color-surface)",
    padding: "8px 12px",
    textTransform: "none",
  }),
};

export function Filters({
  facets = ["group", "season", "conductor", "venue"],
  updateUrl = true,
  initialFilters = {},
  onFiltersChange,
}: FiltersProps) {
  const { availableFacets, handleChange } = useFilters({
    facets,
    updateUrl,
    initialFilters,
    onFiltersChange,
  });

  const activeFacets = availableFacets.filter((facet) =>
    facets.includes(facet.id as FilterFacetId)
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
      type: facet.id as FilterFacetId,
      value: `${facet.id}:${opt.value}`,
    })),
  }));

  const params = new URLSearchParams(useSearchParams() || initialFilters);
  const selectedValues = activeFacets
    .map((facet) => {
      const value = params.get(facet.id);
      if (!value) return null;
      const option = facet.options.find((opt) => opt.value === value);
      if (!option) return null;
      return {
        ...option,
        type: facet.id as FilterFacetId,
        value: `${facet.id}:${option.value}`,
      } as SelectOption;
    })
    .filter((v): v is SelectOption => v !== null);

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
