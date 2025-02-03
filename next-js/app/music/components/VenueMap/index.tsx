"use client";

import dynamic from "next/dynamic";

const VenueMap = dynamic(() => import("./Inner").then((mod) => mod.VenueMap), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-lg bg-muted animate-pulse" />
  ),
});

interface VenueMapProps {
  coordinates: string;
  venueName: string;
}

export default function VenueMapWrapper(props: VenueMapProps) {
  return <VenueMap {...props} />;
}
