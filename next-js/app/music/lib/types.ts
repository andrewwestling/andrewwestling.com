export interface PageProps {
  params: {
    slug: string;
  };
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
}

export interface ConcertFrontmatter {
  date: string;
  group: string;
  works: string | string[] | null;
  conductor: string | string[] | null;
  spotifyPlaylistUrl: string | null;
  venue?: string | null;
  didNotPlay?: boolean;
  [key: string]: any;
}

export interface WorkFrontmatter {
  composer?: string;
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
}

export interface Group extends BaseItem {
  frontmatter: GroupFrontmatter;
}

export interface Conductor extends BaseItem {
  frontmatter: ConductorFrontmatter;
}

export interface Composer extends BaseItem {
  frontmatter: ComposerFrontmatter;
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
}

export type VaultObject = BaseItem;
