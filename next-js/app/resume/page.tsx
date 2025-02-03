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
    <div className="print:hidden w-fit my-8">
      <ButtonLink icon={"📃"} href="/assets/Andrew Westling Resume.pdf">
        Download as PDF
      </ButtonLink>
    </div>

    <ResumeHtml />
  </>
);

export default Resume;
