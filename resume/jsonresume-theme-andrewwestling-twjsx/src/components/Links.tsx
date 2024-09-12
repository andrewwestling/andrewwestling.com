import { beautifyLink } from "../helper";
import { useResume } from "../useResume";

const Links = () => {
  const resume = useResume();

  return (
    <div className="links margin-container-4 no-break">
      <p className="section-title no-alone-1">🔗 Links</p>
      <div className="container">
        <ul>
          {resume.basics?.url && (
            <li className="article">
              <a href={resume.basics.url}>{beautifyLink(resume.basics.url)}</a>
            </li>
          )}
          {resume.basics?.profiles &&
            resume.basics?.profiles?.map((profile) => {
              if (profile.url) {
                return (
                  <li className="article margin-text-4" key={profile.url}>
                    <a href={profile.url}>{beautifyLink(profile.url)}</a>
                  </li>
                );
              }
              return null;
            })}
        </ul>
      </div>
    </div>
  );
};

export default Links;
