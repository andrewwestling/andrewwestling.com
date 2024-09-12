import React from "react";
import ReactDOM from "react-dom/client";
import Resume from "./Resume.tsx";
import resumeJson from "../../resume.json";
import "./styles.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Resume resume={resumeJson} />
  </React.StrictMode>
);
