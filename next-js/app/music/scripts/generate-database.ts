import * as fs from "fs/promises";
import * as path from "path";
import matter from "gray-matter";
import { VaultObject } from "../lib/types";

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

async function generateDatabase(vaultPath: string) {
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
  ] as const;

  for (const dir of directories) {
    const dirPath = path.join(vaultPath, dir.path);
    const objects = await readVaultDirectory(dirPath, dir.type, vaultPath);
    database[dir.type] = objects;
  }

  const outputPath = path.resolve(__dirname, "../data/vault-data.json");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(database, null, 2));

  console.log(`Database generated at ${outputPath}`);
}

// Allow running from command line
if (require.main === module) {
  const vaultPath = process.argv[2];
  if (!vaultPath) {
    console.error("Please provide the vault path as an argument");
    process.exit(1);
  }
  generateDatabase(vaultPath).catch(console.error);
}

export { generateDatabase };
