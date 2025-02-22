import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className} bg-surface dark:bg-surface-dark rounded-lg`}
    >
      <p className="text-preset-3-bold">{title}</p>
      {description && <p className="mt-2 text-preset-2">{description}</p>}
    </div>
  );
}
