import type {
  BaseItem,
  Concert,
  Work,
  Group,
  Conductor,
  Composer,
  Venue,
  Season,
  LocationData,
} from "./index";

export interface Database {
  concert: Concert[];
  work: Work[];
  group: Group[];
  conductor: Conductor[];
  composer: Composer[];
  venue: Venue[];
  rehearsal: BaseItem[];
  sheetMusic: BaseItem[];
  season: Season[];
  orderedBucketList: string[];
  locations: LocationData;
}
