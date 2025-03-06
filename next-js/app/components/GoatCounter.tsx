"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

declare const window: any;

export const GoatCounter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    window.goatcounter?.count({
      path: pathname + searchParams,
    });
  }, [pathname, searchParams]);

  return (
    <Script
      async
      data-goatcounter="https://andrewwestling.goatcounter.com/count"
      src="//gc.zgo.at/count.js"
    />
  );
};
