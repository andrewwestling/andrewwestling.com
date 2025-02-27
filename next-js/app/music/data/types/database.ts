import {
  Concert,
  Work,
  Group,
  Conductor,
  Composer,
  Venue,
  Season,
  BaseItem,
  LocationData,
} from "@music/lib/types";

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
