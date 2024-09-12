import { mdToHtml } from "../helper";
import { useResume } from "../useResume";

const Certificates = () => {
  const resume = useResume();

  if (resume.certificates) {
    return (
      <div className="certificates margin-container-4">
        <p className="section-title no-alone-1">Certificates</p>
        <div className="container">
          {resume.certificates?.map((certificate) => (
            <div
              className="article margin-container-2 no-break"
              key={certificate.name}
            >
              <div className="name markdown">
                <a href={certificate.url}>{mdToHtml(certificate.name)}</a>
              </div>
              <span className="issuer margin-text-2">{certificate.issuer}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default Certificates;
