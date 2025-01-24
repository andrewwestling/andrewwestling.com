import { Metadata } from "next";
import { ResumeHtml } from "./components/ResumeHtml";
import { ButtonLink } from "@components/Button";
import resumeJson from "../../../resume/resume.json";

export const metadata: Metadata = {
  title: "Resume",
  other: { date: resumeJson.meta.lastModified },
};

const Resume = () => (
  <>
    <div className="no-print my-8">
      <ButtonLink href="/assets/Andrew Westling Resume.pdf" target="_blank">
        📃 Download as PDF
      </ButtonLink>
    </div>

    <ResumeHtml />
  </>
);

export default Resume;
