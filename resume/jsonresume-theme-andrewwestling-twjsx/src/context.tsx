import React from "react";
import { ResumeSchema } from "@kurone-kito/jsonresume-types";

export const ResumeContext = React.createContext<ResumeSchema>({});
export const ResumeProvider = ({
  resume,
  children,
}: {
  resume: ResumeSchema;
  children: React.ReactNode;
}) => {
  return (
    <ResumeContext.Provider value={resume}>{children}</ResumeContext.Provider>
  );
};
