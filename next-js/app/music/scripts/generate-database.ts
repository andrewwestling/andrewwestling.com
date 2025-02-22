import * as fs from "fs/promises";
import * as fsSync from "fs";
import * as path from "path";
import matter from "gray-matter";
import {
  Database,
  VaultObject,
  Work,
  Concert,
  Season,
  ConcertWork,
} from "../lib/types";

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

// Helper to convert numbers to roman numerals
function toRomanNumeral(num: number): string {
  const romanNumerals = [
    { value: 50, numeral: "L" },
    { value: 40, numeral: "XL" },
    { value: 10, numeral: "X" },
    { value: 9, numeral: "IX" },
    { value: 5, numeral: "V" },
    { value: 4, numeral: "IV" },
    { value: 1, numeral: "I" },
  ];

  let result = "";
  let remaining = num;

  for (const { value, numeral } of romanNumerals) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }

  return result;
}

// Helper to parse basic Markdown formatting (bold and italics)
function parseBasicMarkdown(text: string): string {
  // Handle bold (both ** and __ syntax)
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.*?)__/g, "<strong>$1</strong>");

  // Handle italics (both * and _ syntax)
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
  text = text.replace(/_(.*?)_/g, "<em>$1</em>");

  return text;
}

// Helper to parse a movement line and convert its number to roman numerals
function parseMovementLine(line: string): string {
  // Check if the line already starts with a roman numeral
  if (line.match(/^[IVXL]+\./)) {
    return parseBasicMarkdown(line);
  }

  // Check if the line starts with an arabic number
  const arabicMatch = line.match(/^(\d+)\.(.*)/);
  if (arabicMatch) {
    const [, number, rest] = arabicMatch;
    return parseBasicMarkdown(
      `${toRomanNumeral(parseInt(number, 10))}.${rest}`
    );
  }

  // If no number found, return the line as is with markdown parsing
  return parseBasicMarkdown(line);
}

// Helper to parse movements from a work's content
function parseWorkMovements(content: string): string[] | undefined {
  const movementsMatch = content.match(/## Movements\n([\s\S]*?)(?=\n##|$)/);
  if (!movementsMatch) return undefined;

  const movementsContent = movementsMatch[1].trim();
  const movements: string[] = [];

  // Split into lines and process each one
  const lines = movementsContent.split("\n");

  // First, analyze the list to determine if it's a simple numbered list
  // that should be converted to roman numerals
  const isSimpleNumberedList = lines.every((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return true; // Skip empty lines
    return !!trimmedLine.match(/^\d+\.\s*[^IVX\d].*$/); // Matches "1. Something" but not "1. IX. Something" or "1. 1812"
  });

  let currentMovementNumber = 1;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Handle unordered list items (-, *)
    if (trimmedLine.startsWith("-") || trimmedLine.startsWith("*")) {
      // Just remove the bullet and trim
      movements.push(trimmedLine.replace(/^[-*]\s*/, "").trim());
      continue;
    }

    // Handle ordered list items (1., 2., etc)
    const orderedListMatch = trimmedLine.match(/^\d+\.\s*(.+)$/);
    if (orderedListMatch) {
      if (isSimpleNumberedList) {
        // For simple numbered lists, convert to roman numerals
        movements.push(
          `${toRomanNumeral(currentMovementNumber)}. ${orderedListMatch[1]}`
        );
      } else {
        // For complex lists, preserve the original text
        movements.push(orderedListMatch[1]);
      }
      currentMovementNumber++;
      continue;
    }

    // If it's not a list item but not empty, include it as is
    movements.push(trimmedLine);
  }

  return movements.length > 0 ? movements : undefined;
}

// Helper to parse Program Details blocks from concert content
function parseProgramDetails(
  content: string,
  works: Work[]
): ConcertWork[] | undefined {
  // Look for the Program Details section
  const lines = content.split("\n");
  const programDetailsIndex = lines.findIndex(
    (line) => line.trim() === "## Program Details"
  );
  if (programDetailsIndex === -1) return undefined;

  const programDetailsLines: string[] = [];

  // Start from the line after "## Program Details"
  for (let i = programDetailsIndex + 1; i < lines.length; i++) {
    const line = lines[i];

    // Stop if we hit another heading or horizontal rule
    if (line.trim().startsWith("##") || line.trim() === "---") break;

    // Add non-empty lines
    if (line.trim()) {
      programDetailsLines.push(line);
    }
  }

  if (programDetailsLines.length === 0) return undefined;

  // Create a map of work titles to Work objects for faster lookup
  const workMap = new Map(works.map((work) => [work.title, work]));

  const programWorks: ConcertWork[] = [];
  let currentWork: Partial<ConcertWork> | null = null;
  let parsingState: "none" | "soloists" | "movements" = "none";

  // Process each line
  for (const line of programDetailsLines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Get the indentation level (number of leading tabs/spaces)
    const indentLevel = line.search(/\S|$/);

    // Check if this is a work line (starts with - or * and contains [[]])
    const workMatch = trimmedLine.match(/^[-*]\s*\[\[(.*?)\]\]/);
    if (workMatch && indentLevel === 0) {
      // If we have a current work, push it to the array
      if (currentWork?.work) {
        programWorks.push(currentWork as ConcertWork);
      }

      // Look up the work in the works array
      const workTitle = extractTitleFromWikiLink(workMatch[0]);
      const workObject = workMap.get(workTitle);

      // Only create a new work entry if we found the work
      if (workObject) {
        // Get default movements from the work if they exist
        const defaultMovements = parseWorkMovements(workObject.content);

        currentWork = {
          work: workObject,
          // Only set default movements if they exist
          ...(defaultMovements && { movements: defaultMovements }),
        };
        parsingState = "none";
      } else {
        console.warn(
          `Warning: Work "${workTitle}" not found in works database`
        );
        currentWork = null;
      }
      continue;
    }

    // Only process other lines if we have a current work
    if (!currentWork) continue;

    // Check for conductor (at first indent level) (Note: this should always be on the same line, like `- Conductor: [[Their Name]]`)
    if (indentLevel > 0 && trimmedLine.startsWith("- Conductor:")) {
      const conductorMatch = trimmedLine.match(/\[\[(.*?)\]\]/);
      if (conductorMatch) {
        currentWork.conductor = extractTitleFromWikiLink(conductorMatch[0]);
      }
      continue;
    }

    // Check for soloists section (at first indent level)
    if (indentLevel > 0 && trimmedLine.startsWith("- Soloist")) {
      currentWork.soloists = [];
      parsingState = "soloists";
      continue;
    }

    // Check for movements section (at first indent level)
    if (indentLevel > 0 && trimmedLine.startsWith("- Movement")) {
      currentWork.movements = [];
      parsingState = "movements";
      continue;
    }

    // Add soloist entries (at second indent level)
    if (
      parsingState === "soloists" &&
      indentLevel > 1 &&
      trimmedLine.match(/^[-*]\s/)
    ) {
      currentWork.soloists?.push(trimmedLine.replace(/^[-*]\s*/, "").trim());
      continue;
    }

    // Add movement entries (at second indent level)
    if (
      parsingState === "movements" &&
      indentLevel > 1 &&
      trimmedLine.match(/^[-*]\s/)
    ) {
      const movementText = trimmedLine.replace(/^[-*]\s*/, "").trim();
      currentWork.movements?.push(parseMovementLine(movementText));
    }
  }

  // Don't forget to add the last work if there is one
  if (currentWork?.work) {
    programWorks.push(currentWork as ConcertWork);
  }

  return programWorks.length > 0 ? programWorks : undefined;
}

// Helper to create default program details from works list
function createDefaultProgramDetails(
  works: Work[],
  workTitles: string[]
): ConcertWork[] {
  // Create a map of work titles to Work objects for faster lookup
  const workMap = new Map(works.map((work) => [work.title, work]));

  // Process works in the order they appear in workTitles
  return workTitles
    .map((workTitle) => {
      const workObject = workMap.get(workTitle);
      if (!workObject) {
        console.warn(
          `Warning: Work "${workTitle}" not found in works database`
        );
        return null;
      }

      // Get default movements from the work if they exist
      const defaultMovements = parseWorkMovements(workObject.content);

      return {
        work: workObject,
        ...(defaultMovements && { movements: defaultMovements }),
      } as ConcertWork;
    })
    .filter((work): work is ConcertWork => work !== null);
}

async function readVaultDirectory(
  dirPath: string,
  type: VaultObject["type"],
  vaultPath: string,
  works?: Work[]
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
          vaultPath,
          works
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

          // Parse program details if they exist and we have works available
          if (works && processedFrontmatter.works) {
            // First try to parse explicit program details
            const explicitProgramDetails = parseProgramDetails(content, works);

            if (explicitProgramDetails) {
              // Use the explicit program details order
              processedFrontmatter.programDetails = explicitProgramDetails;
              // Update the works array to match the program details order
              processedFrontmatter.works = explicitProgramDetails.map(
                (details) => details.work.title
              );
            } else {
              // If no explicit program details, create default ones from the works list
              processedFrontmatter.programDetails = createDefaultProgramDetails(
                works,
                Array.isArray(processedFrontmatter.works)
                  ? processedFrontmatter.works
                  : [processedFrontmatter.works]
              );
            }
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

  // Process works first
  const worksPath = path.join(vaultPath, "Works");
  const works = (await readVaultDirectory(
    worksPath,
    "work",
    vaultPath
  )) as Work[];
  database.work = works;

  // Then process all other directories
  const directories = [
    { path: "Concerts", type: "concert" },
    { path: "Composers", type: "composer" },
    { path: "Conductors", type: "conductor" },
    { path: "Groups", type: "group" },
    { path: "Rehearsals", type: "rehearsal" },
    { path: "Sheet Music", type: "sheet-music" },
    { path: "Venues", type: "venue" },
    { path: "Seasons", type: "season" },
  ] as const;

  for (const dir of directories) {
    const dirPath = path.join(vaultPath, dir.path);
    // Pass the works array when processing concerts
    const objects = await readVaultDirectory(
      dirPath,
      dir.type,
      vaultPath,
      dir.type === "concert" ? works : undefined
    );

    // Filter out didNotPlay concerts if includeDidNotPlay is false
    if (dir.type === "concert" && !includeDidNotPlay) {
      database[dir.type] = objects.filter((obj) => !obj.frontmatter.didNotPlay);
    } else {
      database[dir.type] = objects;
    }
  }

  // After loading all the files, calculate counts and process seasons
  calculateConcertCounts(database as unknown as Database);
  processSeasons(database as unknown as Database);
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
