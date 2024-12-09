"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in react-leaflet
const icon = L.icon({
  iconUrl: "/assets/leaflet/marker-icon.png",
  iconRetinaUrl: "/assets/leaflet/marker-icon-2x.png",
  shadowUrl: "/assets/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom monochrome style URL from Stadia Maps
const MONOCHROME_URL =
  "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";
const ATTRIBUTION =
  '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';

// NYC County to Borough mapping
const NYC_COUNTIES: Record<string, string> = {
  "Kings County": "Brooklyn",
  "New York County": "Manhattan",
  "Queens County": "Queens",
  "Bronx County": "Bronx",
  "Richmond County": "Staten Island",
};

interface VenueMapProps {
  coordinates: string;
  venueName: string;
}

export default function VenueMap({ coordinates, venueName }: VenueMapProps) {
  const [lat, lng] = coordinates
    .split(",")
    .map((coord) => parseFloat(coord.trim()));
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    // This is needed to fix the map container size after initial render
    window.dispatchEvent(new Event("resize"));

    // Fix Leaflet's default icon path issues
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "/assets/leaflet/marker-icon.png",
      iconRetinaUrl: "/assets/leaflet/marker-icon-2x.png",
      shadowUrl: "/assets/leaflet/marker-shadow.png",
    });

    // Fetch address using reverse geocoding
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.address) {
          const parts = [];

          // Combine house number and road without a comma
          const streetPart = [data.address.house_number, data.address.road]
            .filter(Boolean)
            .join(" ");
          if (streetPart) parts.push(streetPart);

          // Special handling for New York City addresses
          if (data.address.state === "New York") {
            // Check both county and city_district fields for NYC county information
            const countyName =
              data.address.county || data.address.city_district;
            const borough = NYC_COUNTIES[countyName];

            if (borough) {
              parts.push(borough);
            } else if (data.address.city && data.address.city !== "New York") {
              parts.push(data.address.city);
            }
          } else {
            // For non-NYC addresses, use the city name
            if (data.address.city) {
              parts.push(data.address.city);
            } else if (data.address.town) {
              parts.push(data.address.town);
            }
          }

          // Add state
          if (data.address.state) {
            parts.push(data.address.state);
          }

          setAddress(parts.join(", "));
        }
      })
      .catch((error) => {
        console.error("Error fetching address:", error);
      });
  }, [lat, lng]);

  return (
    <div className="grid gap-4">
      {address && (
        <div className="text-base text-muted">
          <span className="font-medium">Address:</span> {address}
        </div>
      )}
      <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={[lat, lng]}
          zoom={14}
          scrollWheelZoom={true}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution={ATTRIBUTION}
            url={MONOCHROME_URL}
            maxZoom={20}
          />
          <ZoomControl position="bottomright" />
          <Marker position={[lat, lng]} icon={icon}>
            <Popup>
              <div className="grid gap-1">
                <div className="text-base font-medium">{venueName}</div>
                {address && <div className="text-sm text-muted">{address}</div>}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
