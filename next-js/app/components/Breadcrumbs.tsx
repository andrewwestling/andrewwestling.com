"use client";

import Link from "next/link";
import { Fragment, useRef, useEffect, useState } from "react";

import { Crumb } from "../@breadcrumbs/default";

import { HomeIcon } from "./HomeIcon";

const NavigationContainer = ({ children }: { children: React.ReactNode }) => (
  <nav className="flex items-center w-full relative">{children}</nav>
);

const FixedSection = ({
  children,
  showLeftGradient,
}: {
  children: React.ReactNode;
  showLeftGradient: boolean;
}) => (
  <div className="flex-none z-10 bg-background dark:bg-background-dark relative">
    {children}
    {showLeftGradient && (
      <div className="absolute right-[-32px] top-0 bottom-0 w-8 bg-opacity-80 bg-gradient-to-r from-background dark:from-background-dark to-transparent z-10" />
    )}
  </div>
);

const ScrollSection = ({
  children,
  scrollContainerRef,
  showRightGradient,
}: {
  children: React.ReactNode;
  scrollContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  showRightGradient: boolean;
}) => (
  <div className="flex-1 relative min-w-0">
    <div
      className="overflow-x-auto w-full scrollbar-hide"
      ref={scrollContainerRef}
    >
      <div className="flex items-center mb-1">{children}</div>
    </div>
    {showRightGradient && (
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-opacity-10 bg-gradient-to-l from-background dark:from-background-dark to-transparent z-10" />
    )}
  </div>
);

export const Breadcrumbs = ({
  path,
  crumbs = [],
}: {
  path?: string;
  crumbs: Crumb[];
}) => {
  const isHomePath = path === "/";
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScroll = () => {
      const hasOverflow = container.scrollWidth > container.clientWidth;
      setShowLeftGradient(hasOverflow && container.scrollLeft > 0);
      setShowRightGradient(
        hasOverflow &&
          container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    };

    // Initial check with a small delay to ensure proper rendering
    const timeoutId = setTimeout(checkScroll, 0);

    checkScroll();
    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    // Add mutation observer to detect content changes
    const observer = new MutationObserver(checkScroll);
    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      clearTimeout(timeoutId);
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      observer.disconnect();
    };
  }, []);

  if (isHomePath) {
    return (
      <NavigationContainer>
        <FixedSection showLeftGradient={showLeftGradient}>
          <span className="homepage-home-crumb font-medium">
            <HomeIcon noHover />
          </span>
        </FixedSection>
        <ScrollSection
          scrollContainerRef={scrollContainerRef}
          showRightGradient={showRightGradient}
        >
          <span className="homepage-menu-crumb whitespace-nowrap">
            <Link href="/projects">Projects</Link>
          </span>
          <span className="homepage-menu-crumb whitespace-nowrap">
            <Link href="/resume">Resume</Link>
          </span>
          <span className="homepage-menu-crumb whitespace-nowrap">
            <Link href="/music">Music Library</Link>
          </span>
        </ScrollSection>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <FixedSection showLeftGradient={showLeftGradient}>
        {crumbs[0]?.isHome && (
          <span>
            <Link href={crumbs[0].href}>
              <HomeIcon noHover={isHomePath} />
            </Link>
          </span>
        )}
      </FixedSection>
      <ScrollSection
        scrollContainerRef={scrollContainerRef}
        showRightGradient={showRightGradient}
      >
        {crumbs.slice(1).map((crumb) => (
          <Fragment key={crumb.href}>
            {crumb === crumbs.at(-1) ? (
              <span className="breadcrumb-item font-medium whitespace-nowrap">
                {crumb.label}
              </span>
            ) : (
              <span className="breadcrumb-item whitespace-nowrap">
                <Link href={crumb.href}>{crumb.label}</Link>
              </span>
            )}
          </Fragment>
        ))}
      </ScrollSection>
    </NavigationContainer>
  );
};
