interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  "data-umami-event"?: string;
}

export function ExternalLink({
  href,
  children,
  className = "",
  "data-umami-event": umamiEvent,
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline ${className}`}
      data-umami-event={umamiEvent ?? `Outbound link: ${href}`}
    >
      {children}
      <svg
        // Use 1em width/height to match the height of the text; use top -0.125em to roughly center it
        className="inline-block w-[1em] h-[1em] ml-0.5 relative -top-[0.125em]"
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
    </a>
  );
}
