interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTitle({ children, className = "" }: PageTitleProps) {
  return <h1 className={`text-preset-7 ${className}`}>{children}</h1>;
}
