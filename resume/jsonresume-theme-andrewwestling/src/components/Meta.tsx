import React from "react";
import { formatDateLong } from "../utils";

interface MetaProps {
  lastModified?: string;
}

export function MetaSection({ lastModified }: MetaProps) {
  if (!lastModified) return null;

  return (
    <div className="text-preset-1 text-muted dark:text-muted-dark mt-8">
      Updated {formatDateLong(lastModified)}
    </div>
  );
}
