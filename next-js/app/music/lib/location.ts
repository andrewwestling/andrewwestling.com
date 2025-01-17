import { Venue } from "./types";

// NYC County to Borough mapping
export const NYC_COUNTIES: Record<string, string> = {
  "Kings County": "Brooklyn",
  "New York County": "Manhattan",
  "Queens County": "Queens",
  "Bronx County": "Bronx",
  "Richmond County": "Staten Island",
};

export async function getLocationFromCoordinates(
  coordinates: string
): Promise<string | null> {
  try {
    const [lat, lng] = coordinates
      .split(",")
      .map((coord) => parseFloat(coord.trim()));
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      {
        cache: "force-cache", // Cache the response
        headers: {
          "User-Agent": "andrewwestling.com/2.0.0", // Required by Nominatim's usage policy
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

    if (data.address) {
      // Special handling for New York City addresses
      if (data.address.state === "New York") {
        // Check both county and city_district fields for NYC county information
        const countyName = data.address.county || data.address.city_district;
        const borough = NYC_COUNTIES[countyName];

        if (borough) {
          return `${borough}, New York`;
        }
      }

      // For US non-NYC addresses, use city/town/county and state
      const city =
        data.address.city || data.address.town || data.address.county;
      if (city && data.address.state) {
        return `${city}, ${data.address.state}`;
      }

      // If we don't have a state, use the city and country
      if (city && data.address.country) {
        return `${city}, ${data.address.country}`;
      }

      // If we have nothing else useful, just return the country
      if (data.address.country) {
        return `${data.address.country}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
}

export async function getLocationsForVenues(
  venues: Array<{ slug: string; frontmatter: { coordinates?: string } }>
) {
  // Get locations for all venues with coordinates
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

  // Create a map for easy lookup
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
