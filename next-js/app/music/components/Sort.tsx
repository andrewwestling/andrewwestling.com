"use client";

import type { SortOption } from "@music/hooks/useSorting";

interface SortProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Sort({ options, value, onChange }: SortProps) {
  return (
    <div className={`flex items-center gap-1 text-muted`}>
      <span className="text-muted">Sorted</span>
      <select
        value={value}
        title="Change sorting"
        onChange={(e) => onChange(e.target.value)}
        className="inline-block underline appearance-none bg-transparent border-none p-0 cursor-pointer focus:outline-none focus:ring-0"
      >
        <option value="" disabled>
          Sort...
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
