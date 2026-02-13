import React from "react";
import { Basics } from "../types";
import { formatLocation } from "../utils";
import { ExternalLink } from "./shared";
import { Markdown } from "./Markdown";

export function BasicsSection({ basics }: { basics?: Basics }) {
  if (!basics) return null;

  const { name, label, email, phone, summary, location } = basics;
  const formattedLocation = location
    ? formatLocation(location.city, location.region, location.countryCode)
    : "";

  return (
    <header className="mb-8">
      {/* Two-column layout for name/title and contact info */}
      <div className="sm:grid sm:grid-cols-3 sm:gap-8">
        {/* Left column - Name and title */}
        <div className="sm:col-span-2">
          <h1 className="text-preset-7 mb-2">{name}</h1>
          {label && <div className="text-preset-4">{label}</div>}
        </div>

        {/* Right column - Contact info */}
        <div className="mt-4 sm:mt-0 space-y-1 sm:border-l sm:border-highlight sm:pl-4 sm:col-span-1 h-fit">
          {phone && (
            <div className="text-preset-3">
              <span className="mr-2">📞</span>
              <ExternalLink href={`tel:${phone}`}>{phone}</ExternalLink>
            </div>
          )}
          {email && (
            <div className="text-preset-3">
              <span className="mr-2">✉️</span>
              <ExternalLink href={`mailto:${email}`} data-umami-event="Click Email (Resume)">{email}</ExternalLink>
            </div>
          )}
          {formattedLocation && (
            <div className="text-preset-3">
              <span className="mr-2">📍</span>
              {formattedLocation}
            </div>
          )}
        </div>
      </div>

      {/* Summary below the two columns */}
      {summary && (
        <div className="mt-6">
          <Markdown>{summary}</Markdown>
        </div>
      )}
    </header>
  );
}
