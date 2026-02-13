"use client";

import Script from "next/script";

const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const HOST_URL = "https://u.andrewwestling.com";

export const Umami = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const devOverride =
    typeof window !== "undefined" &&
    localStorage.getItem("umami_dev") === "true";

  if (!WEBSITE_ID || (!isProduction && !devOverride)) {
    return null;
  }

  return (
    <Script
      defer
      src={`${HOST_URL}/script.js`}
      data-website-id={WEBSITE_ID}
      data-host-url={HOST_URL}
    />
  );
};
