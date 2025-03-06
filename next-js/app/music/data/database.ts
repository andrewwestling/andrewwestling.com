import { Database } from "@music/data/types";

// Import all JSON files
import composer from "./json/composers.json";
import concert from "./json/concerts.json";
import conductor from "./json/conductors.json";
import group from "./json/groups.json";
import rehearsal from "./json/rehearsals.json";
import season from "./json/seasons.json";
import sheetMusic from "./json/sheet-music.json";
import venue from "./json/venues.json";
import work from "./json/works.json";
import orderedBucketList from "./json/bucket-list.json";
import locations from "./json/locations.json";

// Create the database structure
const database: Database = {
  composer,
  concert,
  conductor,
  group,
  rehearsal,
  season,
  sheetMusic,
  venue,
  work,
  orderedBucketList,
  locations,
};

export default database;
