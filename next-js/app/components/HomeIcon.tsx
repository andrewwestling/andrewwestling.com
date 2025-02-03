import NextImage from "next/image";

interface HomeIconProps {
  noHover?: boolean;
}

export function HomeIcon({ noHover }: HomeIconProps) {
  return (
    <span className="group">
      <NextImage
        src="/assets/a.png"
        alt="Andrew Westling 'A' logo"
        width={36}
        height={36}
        className={`rounded-full inline-block p-[2px] ${
          noHover
            ? ""
            : "group-hover:shadow-lg border border-solid border-text dark:border-text-dark group-hover:border-primary"
        }`}
      />
      <span className="sr-only">Home</span>
      <span className={`ml-2 hidden sm:inline ${noHover ? "font-medium" : ""}`}>
        andrewwestling.com
      </span>
    </span>
  );
}
