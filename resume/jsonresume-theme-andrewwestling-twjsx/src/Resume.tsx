import { ResumeSchema } from "@kurone-kito/jsonresume-types";
import { ResumeProvider } from "./context";
import Basics from "./components/Basics";
import Work from "./components/Work";
import Projects from "./components/Projects";
import Publications from "./components/Publications";
import Volunteer from "./components/Volunteer";
import Skills from "./components/Skills";
import Education from "./components/Education";
import Certificates from "./components/Certificates";
import Awards from "./components/Awards";
import References from "./components/References";
import Languages from "./components/Languages";
import Interests from "./components/Interests";
import Links from "./components/Links";
import Meta from "./components/Meta";

const Resume = ({ resume }: { resume: ResumeSchema }) => {
  return (
    <ResumeProvider resume={resume}>
      <div className="content">
        <Basics />
        <div className="flex">
          <div className="main">
            <Work />
            <Projects />
            <Publications />
            <Volunteer />
          </div>
          <div className="side">
            <Skills />
            <Education />
            <Certificates />
            <Awards />
            <References />
            <Languages />
            <Interests />
            <Links />
            <Meta />
          </div>
        </div>
      </div>
    </ResumeProvider>
  );
};

export default Resume;
