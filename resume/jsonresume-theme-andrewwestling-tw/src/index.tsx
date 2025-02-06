import React from "react";
import ReactDOMServer from "react-dom/server";
import { Resume } from "./types";
import { ResumeComponent } from "./components/Resume";
import fs from "fs";
import path from "path";

function render(resume: Resume) {
  // Read the CSS file
  const cssPath = path.join(__dirname, "styles.css");
  const css = fs.readFileSync(cssPath, "utf8");

  const html = ReactDOMServer.renderToString(
    <ResumeComponent resume={resume} />
  );

  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${resume.basics?.name || "Resume"}</title>
    <style>${css}</style>
</head>
<body>
    ${html}
</body>
</html>`;
}

module.exports = {
  render: render,
};
