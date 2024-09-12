import React from "react";
import { ResumeContext } from "./context";

export const useResume = () => {
  return React.useContext(ResumeContext);
};
