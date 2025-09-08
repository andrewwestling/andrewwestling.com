export const buttonClasses = [
  "bg-surface",
  "dark:bg-surface-dark",
  "py-2", // Keeping the original button padding-y
  "px-4", // Keeping the original button padding-x
  "rounded-md",
  "cursor-pointer",
  "flex",
  "flex-row",
  "items-center",
  "justify-center",
  "shadow-sm",
  "hover:shadow-md",
  "dark:hover:border-muted",
  "border",
  "border-solid",
  "border-border",
  "dark:border-border-dark",
  "transition-shadow",
  "duration-300",
  "ease-in-out",
  "text-sm",
  "select-none",
  "disabled:hover:shadow-none",
  "disabled:cursor-not-allowed",
  "disabled:opacity-50",
  "dark:disabled:hover:bg-surface-dark",
].join(" ");

export const Button = ({
  className,
  icon,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ReactNode;
}) => (
  <button className={`${buttonClasses} ${className ?? ""}`} {...props}>
    {icon && <span className="mr-1 no-underline">{icon}</span>}
    {children}
  </button>
);

interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
  icon?: React.ReactNode;
}

export const ButtonLink = ({
  external,
  className,
  icon,
  children,
  ...props
}: ButtonLinkProps) => (
  <a
    className={`no-underline ${buttonClasses} ${className ?? ""}`}
    {...props}
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
  >
    {icon && <span className="mr-1 no-underline">{icon}</span>}
    <span className="underline">{children}</span>
    {external && (
      <svg
        className="w-4 h-4 ml-1 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    )}
  </a>
);
