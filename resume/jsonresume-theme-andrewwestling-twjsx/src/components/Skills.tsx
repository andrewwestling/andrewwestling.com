import { useResume } from "../useResume";

const Skills = () => {
  const resume = useResume();

  if (resume.skills) {
    return (
      <div className="skills margin-container-4">
        <p className="section-title no-alone-1">🔧 Tools</p>
        <div className="container">
          {resume.skills.map((skill, index) => (
            <div className="article no-break" key={index}>
              <label>{skill.name}</label>
              {skill.keywords && (
                <span className="margin-text-2">
                  <p>{skill.keywords?.join(", ")}</p>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default Skills;
