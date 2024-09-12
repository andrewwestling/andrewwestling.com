import { calcDateRange, mdToHtml } from "../helper";
import { useResume } from "../useResume";

const Volunteer = () => {
  const resume = useResume();

  if (resume.volunteer) {
    return (
      <div className="volunteer margin-container-4">
        <p className="section-title no-alone-2">Volunteer</p>
        <div className="container">
          {resume.volunteer.map((volunteer) => (
            <div
              className="article margin-container-3"
              key={volunteer.organization}
            >
              <div className="header no-alone-1">
                <div className="table">
                  <div className="left">
                    <span className="title">{volunteer.position}</span>
                    <span className="subtitle margin-text-1">
                      <a href={volunteer.url}>{volunteer.organization}</a>
                    </span>
                  </div>
                  <div className="right">
                    <span className="date">
                      {calcDateRange(volunteer.startDate, volunteer.endDate)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="summary markdown margin-text-4">
                {mdToHtml(volunteer.summary)}
              </div>
              {volunteer.highlights && (
                <ul className="highlights margin-text-4 no-break">
                  {volunteer.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
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

export default Volunteer;
