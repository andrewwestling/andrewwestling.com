import * as fs from "fs/promises";
import * as fsSync from "fs";
import * as path from "path";
import matter from "gray-matter";
import { Database, VaultObject, Work, Concert, Season } from "../lib/types";

// Helper to convert strings to URL-friendly slugs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .trim();
}

// Helper to parse date from filename in YYYYMMDDHHmm format
function parseDateFromFilename(filename: string): string | null {
  const match = filename.match(/^(\d{12})/);
  if (!match) return null;

  const dateStr = match[1];
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  const hour = dateStr.slice(8, 10);
  const minute = dateStr.slice(10, 12);

  // Return in ISO format
  return `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;
}

// Helper to ensure a date string is valid
function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

// Helper to extract the title from an Obsidian wiki-link
function extractTitleFromWikiLink(wikiLink: string): string {
  const match = wikiLink.match(/\[\[(.*?)\]\]/);
  return match ? match[1].split("|")[0] : wikiLink;
}

// Helper to process frontmatter values and handle wiki-links
function processFrontmatterValue(value: any): any {
  if (typeof value === "string") {
    if (value.startsWith("[[")) {
      return extractTitleFromWikiLink(value);
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(processFrontmatterValue);
  }
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, processFrontmatterValue(v)])
    );
  }
  return value;
}

// Helper to generate a consistent slug for an object based on its type and properties
function generateSlug(
  type: VaultObject["type"],
  filename: string,
  title: string,
  frontmatter: Record<string, any>
): string {
  // First check if there's a slug in frontmatter
  if (frontmatter.slug) {
    return frontmatter.slug;
  }

  // For concerts, use the YYYYMMDDHHmm format from filename if no slug provided
  if (type === "concert") {
    const dateFromFilename = parseDateFromFilename(filename);
    if (dateFromFilename) {
      // Extract just the YYYYMMDDHHmm part from the ISO string
      return dateFromFilename.replace(/[^0-9]/g, "").slice(0, 12);
    }
  }

  // For all other types, use a URL-safe version of the title
  return slugify(title);
}

async function readVaultDirectory(
  dirPath: string,
  type: VaultObject["type"],
  vaultPath: string
): Promise<VaultObject[]> {
  const objects: VaultObject[] = [];

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      // Skip files/directories that start with underscore (e.g. _index.md)
      if (entry.name.startsWith("_")) {
        continue;
      }

      if (entry.isDirectory()) {
        // Recursively read subdirectories
        const subObjects = await readVaultDirectory(
          path.join(dirPath, entry.name),
          type,
          vaultPath
        );
        objects.push(...subObjects);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        // Get the relative path from the vault root
        const absolutePath = path.join(dirPath, entry.name);
        const relativePath = path.relative(vaultPath, absolutePath);

        const fileContent = await fs.readFile(absolutePath, "utf-8");
        const { data: frontmatter, content } = matter(fileContent);

        // Process the frontmatter to handle wiki-links
        const processedFrontmatter = processFrontmatterValue(frontmatter);

        // For concerts, handle date priority and omit content
        if (type === "concert") {
          let concertDate = undefined;

          // Try frontmatter date first
          if (
            processedFrontmatter.date &&
            isValidDate(processedFrontmatter.date)
          ) {
            concertDate = new Date(processedFrontmatter.date).toISOString();
          }

          // If no valid frontmatter date, try filename
          if (!concertDate) {
            const dateFromFilename = parseDateFromFilename(entry.name);
            if (dateFromFilename) {
              concertDate = dateFromFilename;
            }
          }

          // Update or remove the date
          if (concertDate) {
            processedFrontmatter.date = concertDate;
          } else {
            delete processedFrontmatter.date;
          }
        }

        const title = path.basename(entry.name, ".md");
        const slug = generateSlug(
          type,
          entry.name,
          title,
          processedFrontmatter
        );

        objects.push({
          slug,
          type,
          path: relativePath,
          title,
          // Only include content if it's not a concert
          content: type === "concert" ? "" : content.trim(),
          frontmatter: processedFrontmatter,
        });
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  return objects;
}

function calculateConcertCounts(database: Database) {
  // Calculate work counts
  database.work.forEach((work) => {
    const count = database.concert.filter((c) => {
      if (c.frontmatter.didNotPlay) return false;
      const works = c.frontmatter.works || [];
      if (Array.isArray(works)) {
        return works.includes(work.title);
      }
      return works === work.title;
    }).length;
    work.concertCount = count;
  });

  // Calculate venue counts
  database.venue.forEach((venue) => {
    const count = database.concert.filter(
      (c) => !c.frontmatter.didNotPlay && c.frontmatter.venue === venue.title
    ).length;
    venue.concertCount = count;
  });

  // Calculate group counts
  database.group.forEach((group) => {
    const count = database.concert.filter(
      (c) => !c.frontmatter.didNotPlay && c.frontmatter.group === group.title
    ).length;
    group.concertCount = count;
  });

  // Calculate conductor counts
  database.conductor.forEach((conductor) => {
    const count = database.concert.filter((c) => {
      if (c.frontmatter.didNotPlay) return false;
      const conductors = Array.isArray(c.frontmatter.conductor)
        ? c.frontmatter.conductor
        : [c.frontmatter.conductor];
      return conductors.includes(conductor.title);
    }).length;
    conductor.concertCount = count;
  });

  // Calculate composer counts
  database.composer.forEach((composer) => {
    const count = database.concert.filter((c) => {
      if (c.frontmatter.didNotPlay) return false;
      const works = Array.isArray(c.frontmatter.works)
        ? c.frontmatter.works
        : [c.frontmatter.works];
      return works.some((workTitle) => {
        if (!workTitle) return false;
        const workObj = database.work.find((w) => w.title === workTitle);
        return workObj?.frontmatter.composer === composer.title;
      });
    }).length;
    composer.concertCount = count;
  });
}

function processSeasons(database: Database) {
  // Process each season
  (database.season as Season[]).forEach((season) => {
    // Find concerts that belong to this season
    const seasonConcerts = (database.concert as Concert[]).filter((concert) => {
      return concert.frontmatter.season === season.slug;
    });

    // Get unique works from these concerts
    const works = new Set<string>();
    seasonConcerts.forEach((concert) => {
      const concertWorks = concert.frontmatter.works || [];
      if (Array.isArray(concertWorks)) {
        concertWorks.forEach((work) => works.add(work));
      } else if (concertWorks) {
        works.add(concertWorks);
      }
    });

    // Set concert and work slugs for the season
    season.concertSlugs = seasonConcerts.map((concert) => concert.slug);
    season.workSlugs = Array.from(works)
      .map(
        (workTitle) =>
          (database.work as Work[]).find((w) => w.title === workTitle)?.slug
      )
      .filter((slug): slug is string => slug !== undefined);
  });
}

// Helper to process Bucket List
function processBucketList(database: Database, vaultPath: string) {
  // Read the Bucket List file
  const bucketListPath = path.join(vaultPath, "Bucket List.md");

  try {
    const fileContent = fsSync.readFileSync(bucketListPath, "utf-8");
    const { content } = matter(fileContent);

    // Parse the content to find work titles, handling various formats
    const bucketListWorks = content
      .split("\n")
      .map((line) => {
        // Remove leading dash or bullet points
        line = line.replace(/^[-*•]\s*/, "").trim();

        // Extract title from wiki-link
        const wikiLinkMatch = line.match(/\[\[(.*?)\]\]/);
        if (wikiLinkMatch) {
          // If it's a wiki-link, extract the title
          return extractTitleFromWikiLink(wikiLinkMatch[0]);
        }

        // If it's a markdown link
        const markdownLinkMatch = line.match(/\[([^\]]+)\]\([^\)]+\)/);
        if (markdownLinkMatch) {
          return markdownLinkMatch[1];
        }

        // If it's a plain text title
        return line;
      })
      .filter((line) => line.length > 0);

    // Store the ordered list in the database
    database.orderedBucketList = bucketListWorks;

    // Mark works in the database as bucket list works
    database.work.forEach((work) => {
      work.bucketList = bucketListWorks.some((bucketWork) => {
        // Try exact match first
        if (work.title.toLowerCase() === bucketWork.toLowerCase()) return true;

        // Then try partial match (useful for variations in titles)
        return work.title.toLowerCase().includes(bucketWork.toLowerCase());
      });
    });
  } catch (error) {
    console.warn("Could not read Bucket List file:", error);
  }
}

async function generateDatabase({
  vaultPath,
  includeDidNotPlay = false,
}: {
  vaultPath: string;
  includeDidNotPlay?: boolean;
}) {
  const database: Record<string, VaultObject[]> = {};

  const directories = [
    { path: "Concerts", type: "concert" },
    { path: "Composers", type: "composer" },
    { path: "Conductors", type: "conductor" },
    { path: "Groups", type: "group" },
    { path: "Rehearsals", type: "rehearsal" },
    { path: "Sheet Music", type: "sheet-music" },
    { path: "Venues", type: "venue" },
    { path: "Works", type: "work" },
    { path: "Seasons", type: "season" },
  ] as const;

  for (const dir of directories) {
    const dirPath = path.join(vaultPath, dir.path);
    const objects = await readVaultDirectory(dirPath, dir.type, vaultPath);

    // Filter out didNotPlay concerts if includeDidNotPlay is false
    if (dir.type === "concert" && !includeDidNotPlay) {
      database[dir.type] = objects.filter((obj) => !obj.frontmatter.didNotPlay);
    } else {
      database[dir.type] = objects;
    }
  }

  // After loading all the files, calculate counts and process seasons
  calculateConcertCounts(database as unknown as Database); // TODO: Fix types here
  processSeasons(database as unknown as Database); // TODO: Fix types here
  processBucketList(database as unknown as Database, vaultPath);

  const outputPath = path.resolve(__dirname, "../data/vault-data.json");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(database, null, 2));

  console.log(`Database generated at ${outputPath}`);
}

// Allow running from command line
if (require.main === module) {
  const args = process.argv.slice(2);
  let vaultPath: string | undefined;
  let includeDidNotPlay = false;

  // Parse arguments
  args.forEach((arg) => {
    if (arg === "--include-dnp") {
      includeDidNotPlay = true;
    } else if (!vaultPath) {
      vaultPath = arg;
    }
  });

  if (!vaultPath) {
    console.error("Please provide the vault path as an argument");
    console.error("Usage: generate-database <vault-path> [--include-dnp]");
    process.exit(1);
  }

  generateDatabase({ vaultPath, includeDidNotPlay }).catch(console.error);
}

export { generateDatabase };
