import { calcLocation, mdToHtml } from "../helper";
import { useResume } from "../useResume";

const Basics = () => {
  const resume = useResume();

  return (
    <div className="basics">
      <div className="flex">
        <div className="main">
          <span className="name">{resume.basics?.name}</span>
          <span className="label">{resume.basics?.label}</span>
        </div>
        <div className="side">
          <ul className="contact">
            {resume.basics?.phone && (
              <li>
                <span>📞</span>
                <span>{resume.basics?.phone}</span>
              </li>
            )}
            {resume.basics?.email && (
              <li>
                <span>✉️</span>
                <a href={`mailto:${resume.basics?.email}`}>
                  {resume.basics?.email}
                </a>
              </li>
            )}
            {resume.basics?.location && (
              <li>
                <span>📍</span>
                <span>{calcLocation(resume.basics?.location)}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
      {resume.basics?.summary && (
        <div className="summary markdown padding-container-3">
          {mdToHtml(resume.basics?.summary)}
        </div>
      )}
    </div>
  );
};

export default Basics;
