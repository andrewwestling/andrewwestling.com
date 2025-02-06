import React from "react";
import { Education } from "../types";
import { formatYearRange } from "../utils";
import { Section, ExternalLink } from "./shared";
import { Markdown } from "./Markdown";

export function EducationSection({ education }: { education?: Education[] }) {
  if (!education?.length) return null;

  return (
    <Section title="🎓 Education">
      <div className="space-y-6">
        {education.map((item, index) => (
          <div key={index} className="no-break">
            <div className="markdown">
              <Markdown>
                {[item.studyType, item.area].filter(Boolean).join(", ")}
              </Markdown>
            </div>
            <div className="text-preset-2 mt-1">
              <ExternalLink href={item.url}>{item.institution}</ExternalLink>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
