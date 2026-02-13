import createMDX from "@next/mdx";
import autolinkHeadings from "remark-autolink-headings";
import collapse from "remark-collapse";
import gfm from "remark-gfm";
import slug from "remark-slug";
import toc from "remark-toc";

const autoLinkHeadingsOptions = {
  behavior: "prepend",
  linkProperties: {
    className: ["anchor-link"],
  },
  content: {
    type: "element",
    tagName: "svg",
    properties: {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16",
      width: "16",
      height: "16",
    },
    children: [
      {
        type: "element",
        tagName: "path",
        properties: {
          color: "inherit",
          fillRule: "evenodd",
          d: "M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z",
        },
        children: [],
      },
    ],
  },
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/andrewwestling",
        permanent: false,
      },
      {
        source: "/linkedin",
        destination: "https://linkedin.com/in/andrewwestling",
        permanent: false,
      },
      {
        source: "/bluesky",
        destination: "https://bsky.app/profile/andrewwestling.com",
        permanent: false,
      },
      {
        source: "/instagram",
        destination: "https://instagram.com/expandrew",
        permanent: false,
      },
      {
        source: "/lastfm",
        destination: "https://last.fm/user/andwest",
        permanent: false,
      },
      {
        source: "/spotify",
        destination: "https://open.spotify.com/user/1283883",
        permanent: false,
      },
    ];
  },
  webpack: (config) => {
    // Add a rule to handle .html files
    config.module.rules.push({
      test: /\.html$/,
      use: "html-loader",
    });

    return config;
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      gfm,
      [collapse, { test: "" }],
      slug,
      [autolinkHeadings, autoLinkHeadingsOptions],
      toc,
    ],
  },
});

export default withMDX(nextConfig);
