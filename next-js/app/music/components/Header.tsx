import NextImage from "next/image";
import NextLink from "next/link";

export function Header() {
  return (
    <header
      role="banner"
      className="flex items-center border-solid border-t-4 border-t-primary border-b border-b-highlight dark:border-b-highlight-dark min-h-[56px]"
    >
      <div className="max-w-container mx-auto w-full px-4">
        <div className="flex">
          <NextLink className="flex items-center" href="/" passHref>
            <NextImage
              src="/assets/a.jpg"
              alt="anti-performances logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="ml-[10px]">anti-performances</span>
          </NextLink>
        </div>
      </div>
    </header>
  );
}
