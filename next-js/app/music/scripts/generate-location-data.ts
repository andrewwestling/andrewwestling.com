import * as fs from "fs/promises";
import * as path from "path";
import matter from "gray-matter";
import {
  getLocationFromCoordinates,
  readLocationCache,
  writeLocationCache,
} from "../lib/location";
import { LocationData } from "../lib/types";

async function generateLocationData({ vaultPath }: { vaultPath: string }) {
  console.log("Generating location data...");

  // Read existing location cache
  let locationCache = await readLocationCache();

  // Read all venue files
  const venuesPath = path.join(vaultPath, "venues");
  const venueFiles = await fs.readdir(venuesPath);

  let processedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  let updatedCount = 0;

  // Create a new cache to store new locations
  const newLocations: LocationData = {};

  // Process each venue file
  for (const file of venueFiles) {
    if (!file.endsWith(".md")) continue;

    try {
      const filePath = path.join(venuesPath, file);
      const content = await fs.readFile(filePath, "utf-8");
      const { data: frontmatter } = matter(content);

      if (!frontmatter.coordinates) {
        skippedCount++;
        continue;
      }

      // Check if location already exists in cache
      const coordinates = frontmatter.coordinates;
      if (locationCache[coordinates] || newLocations[coordinates]) {
        continue;
      }

      const location = await getLocationFromCoordinates(coordinates);

      if (location !== null) {
        // Add to new locations cache
        newLocations[coordinates] = location;
        processedCount++;
        updatedCount++;
        console.log(`✓ ${file}: ${location}`);
      } else {
        errorCount++;
        console.log(`✗ ${file}: Failed to get location`);
      }
    } catch (error) {
      errorCount++;
      console.error(`Error processing ${file}:`, error);
    }
  }

  // Write new locations to cache (will merge with existing)
  await writeLocationCache(newLocations);

  console.log("\nLocation data generation complete!");
  console.log(
    `Total locations in cache: ${
      Object.keys(locationCache).length + Object.keys(newLocations).length
    }`
  );
  console.log(`New locations added: ${updatedCount}`);
  console.log(`Processed: ${processedCount}`);
  console.log(`Skipped (no coordinates): ${skippedCount}`);
  console.log(`Errors: ${errorCount}`);
}

// Run the script if called directly
if (require.main === module) {
  const vaultPath = path.join(process.cwd(), "app/music/data/vault");
  generateLocationData({ vaultPath }).catch(console.error);
}

export default generateLocationData;
