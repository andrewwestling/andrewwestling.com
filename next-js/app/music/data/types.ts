export interface VaultObject {
  id: string;
  title: string;
  type: string;
  path: string;
  content: string;
  frontmatter: Record<string, any>;
}

export type VaultObjectType =
  | "concert"
  | "composer"
  | "conductor"
  | "group"
  | "rehearsal"
  | "sheet-music"
  | "venue"
  | "work"
  | "season";
