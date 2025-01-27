import React from "react";
import ReactDOMServer from "react-dom/server";
import Resume from "./Resume";

const render = (resume) =>
  ReactDOMServer.renderToString(() => {
    return React.createElement(Resume, { resume });
  });

const pdfRenderOptions = {
  scale: 0.92, // Important to keep it from going to single-column!
};

export { render, pdfRenderOptions };
