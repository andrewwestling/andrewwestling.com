import { Metadata } from "next";

import { ButtonLink } from "@components/Button";

import resumeJson from "../../../resume/resume.json";

import { ResumeHtml } from "./components/ResumeHtml";

export const metadata: Metadata = {
  title: "Resume",
  other: { date: resumeJson.meta.lastModified },
};

const Resume = () => (
  <>
    <div className="print:hidden w-fit my-8">
      <ButtonLink
        icon={"📃"}
        href="/assets/Andrew Westling Resume.pdf"
        data-umami-event="Download Resume PDF"
      >
        Download as PDF
      </ButtonLink>
    </div>

    <ResumeHtml />
  </>
);

export default Resume;
