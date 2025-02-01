"use client";

import { useSearchParams } from "next/navigation";
import Select, { StylesConfig } from "react-select";
import { useFilters } from "@music/hooks/useFilters";

export type FilterFacetId =
  | "group"
  | "season"
  | "conductor"
  | "venue"
  | "composer";

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
  customCounts?: Record<string, Record<string, number>>;
}

const selectStyles: StylesConfig<SelectOption, boolean> = {
  control: (base, state) => ({
    ...base,
    minHeight: "40px",
    backgroundColor: "var(--color-background)",
    borderColor: state.isFocused ? "var(--color-active)" : "var(--color-muted)",
    minWidth: "300px",
    boxShadow: state.isFocused ? "0 0 0 1px var(--color-active)" : "none",
    "&:hover": {
      borderColor: "var(--color-active)",
    },
    cursor: "pointer",
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
    color: state.isSelected
      ? "var(--color-background)"
      : state.isFocused
      ? "var(--color-background)"
      : "var(--color-text)",
    backgroundColor: state.isSelected
      ? "var(--color-selected)"
      : state.isFocused
      ? "var(--color-selected)"
      : "var(--color-surface)",
    "&:active": {
      backgroundColor: "var(--color-selected)",
      color: "var(--color-active)",
    },
    cursor: "pointer",
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
    backgroundColor: "var(--color-surface)",
    border: "1px solid var(--color-muted)",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "var(--color-text)",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "var(--color-muted)",
    "&:hover": {
      backgroundColor: "var(--color-surface)",
      color: "var(--color-text)",
    },
  }),
  groupHeading: (base) => ({
    ...base,
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "var(--color-text)",
    backgroundColor: "var(--color-surface)",
    padding: "8px 12px",
    textTransform: "none",
  }),
};

export function Filters({
  facets = ["group", "season", "conductor", "venue", "composer"],
  updateUrl = true,
  initialFilters = {},
  onFiltersChange,
  customCounts,
}: FiltersProps) {
  const { availableFacets, handleChange } = useFilters({
    facets,
    updateUrl,
    initialFilters,
    onFiltersChange,
    customCounts,
  });

  const activeFacets = availableFacets.filter((facet) =>
    facets.includes(facet.id as FilterFacetId)
  );

  const formatOptionLabel = ({ label, count, type }: SelectOption) => (
    <div className="flex justify-between gap-2">
      <span>{label}</span>
      {count !== undefined && <span>({count})</span>}
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

  const urlParams = useSearchParams();
  const searchParams = updateUrl
    ? urlParams
    : new URLSearchParams(initialFilters);

  const selectedValues = activeFacets
    .map((facet) => {
      const value = searchParams.get(facet.id);
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
          <label className="block text-sm font-medium mb-1">
            {facets.length > 1 ? "Filters" : activeFacets[0]?.label + "s"}
          </label>
          <Select<SelectOption, boolean>
            isMulti={facets.length > 1}
            value={
              facets.length > 1 ? selectedValues : selectedValues[0] || null
            }
            onChange={(newValue) =>
              handleChange(
                facets.length > 1
                  ? (newValue as SelectOption[])
                  : newValue
                  ? [newValue as SelectOption]
                  : []
              )
            }
            options={options}
            formatOptionLabel={formatOptionLabel}
            styles={selectStyles}
            placeholder={`Select ${
              facets.length > 1 ? "filters" : activeFacets[0]?.label + "s"
            }...`}
            isClearable={true}
            isSearchable={true}
          />
        </div>
      </div>
    </div>
  );
}
