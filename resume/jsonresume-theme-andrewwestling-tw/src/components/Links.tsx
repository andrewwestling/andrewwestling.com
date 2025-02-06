import React from "react";
import { Profile } from "../types";
import { Section, ExternalLink } from "./shared";
import { beautifyLink } from "../utils";

interface LinksSectionProps {
  profiles?: Profile[];
  personalUrl?: string;
}

export function LinksSection({ profiles, personalUrl }: LinksSectionProps) {
  if (!profiles?.length && !personalUrl) return null;

  return (
    <Section title="🔗 Links">
      <div className="space-y-2 text-preset-2">
        {personalUrl && (
          <div>
            <ExternalLink href={personalUrl}>
              {beautifyLink(personalUrl)}
            </ExternalLink>
          </div>
        )}
        {profiles?.map((profile, index) => (
          <div key={index}>
            <ExternalLink href={profile.url}>
              {beautifyLink(profile.url)}
            </ExternalLink>
          </div>
        ))}
      </div>
    </Section>
  );
}
