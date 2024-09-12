import { mdToHtml, beautifyArray } from "../helper";
import { useResume } from "../useResume";

const Education = () => {
  const resume = useResume();

  if (resume.education) {
    return (
      <div className="education margin-container-4">
        <p className="section-title no-alone-1">🎓 Education</p>
        <div className="container">
          {resume.education?.map((edu) => (
            <div
              className="article margin-container-2 no-break"
              key={edu.institution}
            >
              <div className="title markdown">
                {mdToHtml(beautifyArray(", ", [edu.studyType, edu.area]))}
              </div>
              <span className="institution margin-text-2">
                <a href={edu.url}>{edu.institution}</a>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default Education;
