import { calcDate } from "../helper";
import { useResume } from "../useResume";

const Meta = () => {
  const resume = useResume();

  if (resume.meta?.lastModified) {
    return (
      <div className="meta margin-container-4 no-break">
        <span className="last-modified">
          Updated {calcDate(resume.meta?.lastModified)}
        </span>
      </div>
    );
  }
  return null;
};

export default Meta;
