import * as fs from "fs/promises";
import * as path from "path";
import { Venue, LocationData } from "@music/data/types";
import database from "@music/data/database";

// NYC County to Borough mapping
const NYC_COUNTIES: Record<string, string> = {
  "Kings County": "Brooklyn",
  "New York County": "Manhattan",
  "Queens County": "Queens",
  "Bronx County": "Bronx",
  "Richmond County": "Staten Island",
};

// Track the last API call time
let lastCallTime = 0;
const RATE_LIMIT_MS = 1000; // 1 second

/**
 * Read the location cache from the database
 */
export async function readLocationCache(): Promise<LocationData> {
  return database.locations;
}

/**
 * Write the location cache to file, merging with existing data
 */
export async function writeLocationCache(
  newCache: LocationData
): Promise<void> {
  // Read existing cache first
  const existingCache = await readLocationCache();

  // Merge new cache with existing cache
  const mergedCache = { ...existingCache, ...newCache };

  // Write the merged cache to the json directory
  const outputPath = path.resolve(
    process.cwd(),
    "app/music/data/json/locations.json"
  );
  await fs.writeFile(outputPath, JSON.stringify(mergedCache, null, 2));
}

/**
 * Get a cached location for given coordinates
 */
export async function getCachedLocation(
  coordinates: string
): Promise<string | null | undefined> {
  const cache = await readLocationCache();
  return cache[coordinates];
}

/**
 * Set a location in the cache
 */
export async function setCachedLocation(
  coordinates: string,
  location: string | null
): Promise<void> {
  const cache = await readLocationCache();
  cache[coordinates] = location;
  await writeLocationCache(cache);
}

/**
 * Determine the most appropriate location string from OpenStreetMap data
 */
function formatLocationFromData(data: any): string | null {
  if (!data.address) return null;

  // Special handling for China
  if (data.address.country === "China") {
    return data.address.state ? `${data.address.state}, China` : "China";
  }

  // Special handling for Mexico
  if (data.address.country === "Mexico") {
    return data.address.state ? `${data.address.state}, Mexico` : "Mexico";
  }

  // Special handling for New York City addresses
  if (data.address.state === "New York") {
    const countyName = data.address.county || data.address.city_district;
    const borough = NYC_COUNTIES[countyName];
    if (borough) {
      return `${borough}, New York`;
    }
  }

  // For other locations, try to create a meaningful location string
  const city = data.address.city || data.address.town || data.address.county;
  const state = data.address.state;
  const country = data.address.country;

  if (city && state) {
    return `${city}, ${state}`;
  }
  if (city && country) {
    return `${city}, ${country}`;
  }

  return country || null;
}

/**
 * Get location from coordinates, with rate limiting and caching
 */
export async function getLocationFromCoordinates(
  coordinates: string
): Promise<string | null> {
  // Check cache first
  const cachedLocation = await getCachedLocation(coordinates);
  if (cachedLocation !== undefined) {
    return cachedLocation;
  }

  // Enforce rate limiting
  const now = Date.now();
  const timeSinceLastCall = now - lastCallTime;
  if (timeSinceLastCall < RATE_LIMIT_MS) {
    await new Promise((resolve) =>
      setTimeout(resolve, RATE_LIMIT_MS - timeSinceLastCall)
    );
  }
  lastCallTime = Date.now();

  try {
    const [lat, lng] = coordinates
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    console.info(`Making a call to OpenStreetMap for ${lat}, ${lng}`);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=en-us&lat=${lat}&lon=${lng}`,
      {
        cache: "force-cache",
        headers: {
          "User-Agent": "andrewwestling.com/2.0.0",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        console.warn("Rate limit exceeded for location service");
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const location = formatLocationFromData(data);

    // Store in cache before returning
    await setCachedLocation(coordinates, location);
    return location;
  } catch (error) {
    console.error("Error fetching location:", error);
    // Cache the error case too to prevent repeated failed requests
    await setCachedLocation(coordinates, null);
    return null;
  }
}

/**
 * Get locations for multiple venues
 */
export async function getLocationsForVenues(
  venues: Array<{ slug: string; frontmatter: { coordinates?: string } }>
) {
  const venueLocations = await Promise.all(
    venues.map(async (venue) => {
      if (venue.frontmatter.coordinates) {
        const location = await getLocationFromCoordinates(
          venue.frontmatter.coordinates
        );
        return { slug: venue.slug, location };
      }
      return { slug: venue.slug, location: null };
    })
  );

  return Object.fromEntries(
    venueLocations.map(({ slug, location }) => [slug, location])
  );
}

/**
 * Gets the display name for a venue string by removing wiki-link brackets
 */
export function getVenueDisplayName(venueString: string): string {
  return venueString.replace(/\[\[|\]\]/g, "");
}

/**
 * Extracts a venue from a frontmatter venue string (which may contain [[brackets]])
 */
export function findVenueFromFrontmatter(
  venueString: string | null | undefined,
  venues: Venue[]
): Venue | undefined {
  if (!venueString) return undefined;
  const venueName = getVenueDisplayName(venueString);
  return venues.find((v) => v.title === venueName);
}
