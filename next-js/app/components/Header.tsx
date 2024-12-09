"use client";

import NextLink from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();
  const isMusicPage = pathname?.startsWith("/music");

  return (
    <header
      role="banner"
      className="flex items-center border-solid border-t-4 border-t-primary border-b border-b-highlight dark:border-b-highlight-dark min-h-[56px]"
    >
      <div className="max-w-container mx-auto w-full px-4">
        <div className="flex items-center">
          <NextLink href="/" className="flex items-center group">
            <NextImage
              src="/assets/a.png"
              alt="Andrew Westling 'A' logo"
              width={32}
              height={32}
              className="rounded-full"
            />
          </NextLink>
          <div className="flex items-center ml-[10px]">
            <NextLink href="/" className="hover:text-primary">
              andrewwestling.com
            </NextLink>
            {isMusicPage && (
              <>
                <span className="text-muted mx-2">/</span>
                <NextLink href="/music" className="hover:text-primary">
                  music
                </NextLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
