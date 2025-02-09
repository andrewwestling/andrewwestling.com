import React from "react";
import { Work } from "../types";
import { formatDateRange, formatYearRange } from "../utils";
import { Section, ExternalLink } from "./shared";
import { Markdown } from "./Markdown";

export function WorkSection({ work }: { work?: Work[] }) {
  if (!work?.length) return null;

  return (
    <Section title="👔 Experience">
      <div className="space-y-12">
        {work.map((item, index) => (
          <div key={index} className="no-break">
            <div className="mb-2">
              <div className="flex justify-between">
                <span className="text-preset-4-bold">{item.position}</span>
                <span className="text-preset-2 text-muted dark:text-muted-dark whitespace-nowrap">
                  {formatDateRange(item.startDate, item.endDate)}
                </span>
              </div>
              <div className="text-preset-3">
                <ExternalLink href={item.url}>{item.name}</ExternalLink>
                {item.name && item.location && " · "}
                {item.location}
              </div>
            </div>
            {item.summary && (
              <div className="mt-2">
                <Markdown>{item.summary}</Markdown>
              </div>
            )}
            {item.highlights && item.highlights.length > 0 && (
              <ul className="mt-4 space-y-2 ps-10 list-revert">
                {item.highlights.map((highlight, i) => (
                  <li key={i} className="text-preset-3">
                    <Markdown>{highlight}</Markdown>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
