import { useResume } from "../useResume";

const References = () => {
  const resume = useResume();

  if (resume.references) {
    return (
      <div className="references margin-container-4">
        <p className="section-title no-alone-2">References</p>
        <div className="container">
          {resume.references.map((reference, index) => (
            <div className="article margin-container-2 no-break" key={index}>
              <span className="name">{reference.name}</span>
              <q className="margin-text-2">{reference.reference}</q>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default References;
