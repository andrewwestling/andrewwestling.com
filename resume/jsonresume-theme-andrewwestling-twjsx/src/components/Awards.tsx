import { mdToHtml } from "../helper";
import { useResume } from "../useResume";

const Awards = () => {
  const resume = useResume();

  if (resume.awards) {
    return (
      <div className="awards margin-container-4">
        <p className="section-title no-alone-1">Awards</p>
        <div className="container">
          {resume.awards?.map((award, index) => (
            <div className="article margin-container-2 no-break" key={index}>
              <div className="header">
                <span className="title">{award.title}</span>
                <span className="awarder margin-text-2">{award.awarder}</span>
              </div>
              <div className="summary markdown margin-text-3">
                {mdToHtml(award.summary)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default Awards;
