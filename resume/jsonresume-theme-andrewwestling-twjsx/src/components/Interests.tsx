import { useResume } from "../useResume";

const Interests = () => {
  const resume = useResume();

  if (resume.interests) {
    return (
      <div className="interests margin-container-4 no-break">
        <p className="section-title no-alone-1">Interests</p>
        <div className="container">
          <ul>
            {resume.interests?.map((interest) => (
              <li key={interest.name} className="article margin-text-2">
                {interest.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  return null;
};

export default Interests;
