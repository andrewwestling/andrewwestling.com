"use client";

import Link from "next/link";
import { HomeIcon } from "./HomeIcon";
import { Crumb } from "../@breadcrumbs/default";
import { Fragment } from "react";

export const Breadcrumbs = ({
  path,
  crumbs = [],
}: {
  path?: string;
  crumbs: Crumb[];
}) => {
  const isHomePath = path === "/";

  if (isHomePath) {
    return (
      <nav>
        <span className="homepage-home-crumb font-medium">
          <HomeIcon noHover />
        </span>
        <span className="homepage-menu-crumb">
          <Link href="/projects">Projects</Link>
        </span>
        <span className="homepage-menu-crumb">
          <Link href="/resume">Resume</Link>
        </span>
        <span className="homepage-menu-crumb">
          <Link href="/music">Music Library</Link>
        </span>
      </nav>
    );
  }

  return (
    <nav>
      {crumbs.map((crumb) => (
        <Fragment key={crumb.href}>
          {crumb === crumbs.at(-1) ? (
            <span className="breadcrumb-item font-medium">
              {crumb.isHome ? <HomeIcon noHover={isHomePath} /> : crumb.label}
            </span>
          ) : (
            <span className="breadcrumb-item">
              <Link href={crumb.href}>
                {crumb.isHome ? <HomeIcon noHover={isHomePath} /> : crumb.label}
              </Link>
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
};
