interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionHeading({
  children,
  className = "",
}: SectionHeadingProps) {
  return (
    <h2 className={`mb-4 text-lg font-semibold ${className}`}>{children}</h2>
  );
}
