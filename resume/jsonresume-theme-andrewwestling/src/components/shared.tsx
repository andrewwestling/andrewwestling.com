import React from "react";

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-preset-4 mb-4">{title}</h2>
      {children}
    </section>
  );
}

export function DateRange({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate?: string;
}) {
  return (
    <div className="text-preset-2 text-muted dark:text-muted-dark">
      {startDate} - {endDate || "Present"}
    </div>
  );
}

export function ExternalLink({
  href,
  children,
  className = "",
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode;
}) {
  if (!href) return <>{children}</>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`hover:text-primary dark:hover:text-primary ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

export function List({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <ul className="list-disc list-inside text-preset-3 mt-2 space-y-1">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export function Keywords({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return <div className="mt-2">{items.join(", ")}</div>;
}
