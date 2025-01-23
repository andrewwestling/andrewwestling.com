interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionHeading({
  children,
  className = "",
}: SectionHeadingProps) {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
}
