interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionHeading({
  children,
  className = "",
}: SectionHeadingProps) {
  return <h2 className={`mb-4 text-preset-6 ${className}`}>{children}</h2>;
}
