import { calcDateRange, calcYearRange, mdToHtml } from "../helper";
import { useResume } from "../useResume";

const Work = () => {
  const resume = useResume();

  if (resume.work) {
    return (
      <div className="work margin-container-4">
        <p className="section-title no-alone-2">👔 Experience</p>
        <div className="container">
          {resume.work.map((work) => (
            <div
              className="article margin-container-4 no-alone-1"
              key={work.name}
            >
              <div className="header">
                <div className="table">
                  <div className="left">
                    <span className="title">{work.position}</span>
                    <span className="subtitle">
                      <a href={work.url}>{work.name}</a>
                      {work.name && work.location && " · "}
                      {work.location}
                    </span>
                  </div>
                  <div className="right">
                    <span
                      className="date"
                      title={
                        calcDateRange(work.startDate, work.endDate) || undefined
                      }
                    >
                      {calcYearRange(work.startDate, work.endDate)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="summary markdown margin-text-4">
                {mdToHtml(work.summary)}
              </div>
              {work.highlights && (
                <ul className="highlights margin-text-4 no-break">
                  {work.highlights.map((highlight, index) => (
                    <li key={index}>
                      <span>{mdToHtml(highlight)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default Work;
