import React from "react";
import { Skill } from "../types";
import { Section } from "./shared";

export function SkillsSection({ skills }: { skills?: Skill[] }) {
  if (!skills?.length) return null;

  return (
    <Section title="🔧 Tools">
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index} className="no-break">
            <div className="text-preset-3-bold">{skill.name}</div>
            {skill.keywords && skill.keywords.length > 0 && (
              <div className="text-preset-2 mt-1">
                {skill.keywords.join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
