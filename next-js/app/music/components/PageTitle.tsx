interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTitle({ children, className = "" }: PageTitleProps) {
  return <h1 className={`text-4xl font-bold ${className}`}>{children}</h1>;
}
