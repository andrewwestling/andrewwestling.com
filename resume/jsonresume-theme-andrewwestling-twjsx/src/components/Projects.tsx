import { arrayToPhrase, calcDateRange, mdToHtml } from "../helper";
import { useResume } from "../useResume";

const Projects = () => {
  const resume = useResume();

  if (resume.projects) {
    return (
      <div className="projects margin-container-4">
        <p className="section-title no-alone-2">Projects</p>
        <div className="container">
          {resume.projects?.map((project) => (
            <div className="article margin-container-3" key={project.name}>
              <div className="header no-alone-1">
                <div className="table">
                  <div className="left">
                    {project.roles?.length && (
                      <span className="title">
                        {arrayToPhrase(project.roles)}
                      </span>
                    )}
                    {project.url && (
                      <span className="subtitle margin-text-1">
                        <a href={project.url}>{project.name}</a>
                      </span>
                    )}
                  </div>
                  <div className="right">
                    <span className="date">
                      {calcDateRange(project.startDate, project.endDate)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="summary markdown margin-text-4">
                {mdToHtml(project.description)}
              </div>
              {project.highlights && (
                <ul className="highlights margin-text-4 no-break">
                  {project.highlights.map((highlight) => (
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

export default Projects;
