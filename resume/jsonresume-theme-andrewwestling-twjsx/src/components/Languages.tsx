import { beautifyArray } from "../helper";
import { useResume } from "../useResume";

const Languages = () => {
  const resume = useResume();

  if (resume.languages) {
    return (
      <div className="languages margin-container-4 no-break">
        <p className="section-title no-alone-1">Languages</p>
        <div className="container">
          <ul>
            {resume.languages?.map((language, index) => (
              <li key={index} className="article margin-text-2">
                {beautifyArray(" · ", [language.language, language.fluency])}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  return null;
};

export default Languages;
