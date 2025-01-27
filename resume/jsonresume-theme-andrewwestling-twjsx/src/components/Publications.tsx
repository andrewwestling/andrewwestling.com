import { calcDate, mdToHtml } from "../helper";
import { useResume } from "../useResume";

const Publications = () => {
  const resume = useResume();

  if (resume.publications) {
    return (
      <div className="publications margin-container-4">
        <p className="section-title no-alone-2">Publications</p>
        <div className="container">
          {resume.publications.map((publication) => (
            <div className="article margin-container-3" key={publication.name}>
              <div className="header no-alone-1">
                <div className="table">
                  <div className="left">
                    <span className="title">
                      <a href={publication.url}>{publication.name}</a>
                    </span>
                    <span className="subtitle margin-text-1">
                      {publication.publisher}
                    </span>
                  </div>
                  <div className="right">
                    <span className="date">
                      {calcDate(publication.releaseDate)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="summary markdown margin-text-4">
                {mdToHtml(publication.summary)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default Publications;
