export interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export interface BaseItem {
  slug: string;
  type: string;
  path: string;
  title: string;
  content: string;
  frontmatter: Record<string, any>;
}

export interface VenueFrontmatter {
  coordinates?: string;
  [key: string]: any;
}

export interface Venue extends BaseItem {
  frontmatter: VenueFrontmatter;
  concertCount: number;
}

export interface ConcertFrontmatter {
  date: string;
  group: string;
  works: string[] | null;
  conductor: string | string[] | null;
  spotifyPlaylistUrl: string | null;
  venue?: string | null;
  didNotPlay?: boolean;
  [key: string]: any;
}

export interface WorkFrontmatter {
  composer?: string;
  catalogue?: string;
  displayName?: string;
  [key: string]: any;
}

export interface GroupFrontmatter {
  location?: string;
  slug?: string;
  [key: string]: any;
}

export interface ConductorFrontmatter {
  [key: string]: any;
}

export interface ComposerFrontmatter {
  [key: string]: any;
}

export interface Concert extends BaseItem {
  frontmatter: ConcertFrontmatter;
}

export interface Work extends BaseItem {
  frontmatter: WorkFrontmatter;
  concertCount: number;
  bucketList?: boolean;
}

export interface Group extends BaseItem {
  frontmatter: GroupFrontmatter;
  concertCount: number;
}

export interface Conductor extends BaseItem {
  frontmatter: ConductorFrontmatter;
  concertCount: number;
}

export interface Composer extends BaseItem {
  frontmatter: ComposerFrontmatter;
  concertCount: number;
}

export interface Season extends BaseItem {
  concertSlugs: string[];
  workSlugs: string[];
}

export interface Database {
  concert: Concert[];
  work: Work[];
  group: Group[];
  conductor: Conductor[];
  composer: Composer[];
  venue: Venue[];
  rehearsal: BaseItem[];
  "sheet-music": BaseItem[];
  season: Season[];
  orderedBucketList: string[];
}

export type VaultObject = BaseItem;

export interface LocationData {
  [coordinates: string]: string | null;
}
