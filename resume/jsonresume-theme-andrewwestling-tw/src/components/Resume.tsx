import React from "react";
import { Resume } from "../types";
import { BasicsSection } from "./Basics";
import { WorkSection } from "./Work";
import { EducationSection } from "./Education";
import { SkillsSection } from "./Skills";
import { LinksSection } from "./Links";
import { MetaSection } from "./Meta";

export function ResumeComponent({ resume }: { resume: Resume }) {
  return (
    <div className="max-w-container mx-auto px-2 mb-24 text-text bg-background dark:text-text-dark dark:bg-background-dark">
      <div className="mb-12 sm:mb-0">
        {/* Full-width header */}
        <BasicsSection basics={resume.basics} />
      </div>

      {/* Two-column layout */}
      <div className="sm:grid sm:grid-cols-3 sm:gap-8">
        {/* Main content - 2/3 width on desktop */}
        <div className="sm:col-span-2 space-y-8 mb-12 sm:mb-0">
          <WorkSection work={resume.work} />
        </div>

        {/* Sidebar - 1/3 width on desktop */}
        <div className="sm:col-span-1 space-y-12 sm:border-l sm:border-highlight sm:pl-4">
          <SkillsSection skills={resume.skills} />
          <EducationSection education={resume.education} />
          <LinksSection
            profiles={resume.basics?.profiles}
            personalUrl={resume.basics?.url}
          />
          <MetaSection lastModified={resume.meta?.lastModified} />
        </div>
      </div>
    </div>
  );
}
