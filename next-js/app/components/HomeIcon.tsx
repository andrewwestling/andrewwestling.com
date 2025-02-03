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
        width={32}
        height={32}
        className={`rounded-full inline-block ${
          noHover ? "" : "group-hover:shadow-lg"
        }`}
      />
      <span className="sr-only">Home</span>
      <span className={`ml-2 hidden sm:inline ${noHover ? "font-medium" : ""}`}>
        andrewwestling.com
      </span>
    </span>
  );
}
