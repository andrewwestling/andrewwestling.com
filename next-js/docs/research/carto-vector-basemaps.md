# Research: CARTO vector basemaps for `VenueMap`

**Question:** Should the Music Library venue map migrate from CARTO raster tiles in React Leaflet to CARTO vector basemaps, and what is the lowest-risk supported route?

**Researched:** 2026-09-09
**Sources:** CARTO and MapLibre primary documentation only.

## Recommendation

**Yes—plan a direct migration to MapLibre GL JS.** CARTO explicitly recommends moving from raster to vector and labels the raster service as being retired. Vector is sharper without a separate retina request, is updated regularly, can be restyled at runtime, and CARTO says it is faster and cheaper to serve. CARTO has not published a raster shutdown date; it says it is considering stopping raster data updates, so this is a planned migration rather than an outage fix. [CARTO Basemaps FAQ](https://docs.carto.com/faqs/carto-basemaps) [CARTO API-key guide](https://carto.com/basemaps/apikey/)

Use MapLibre directly, not a Leaflet vector adapter. CARTO's documented vector migration is from a Leaflet tile template to a `maplibregl.Map` style URL, and its FAQ calls out MapLibre compatibility. Neither CARTO's migration guide nor MapLibre's official documentation provides a first-party Leaflet vector-basemap integration. A Leaflet adapter would add an unendorsed compatibility layer while retaining two rendering models; it is not the supported path established by the primary sources. [CARTO Basemaps FAQ](https://docs.carto.com/faqs/carto-basemaps) [MapLibre GL JS API](https://maplibre.org/maplibre-gl-js/docs/API/)

## Current component and direct mapping

`VenueMap/Inner.tsx` is already a client-only dynamic map with one marker, a text popup, zoom controls, disabled scroll-wheel zoom, `maxZoom: 20`, and a `prefers-color-scheme` listener. This is a contained renderer swap; no other application code imports Leaflet.

| Current raster layer | CARTO vector style URL |
| --- | --- |
| `light_all` | `https://basemaps.cartocdn.com/gl/positron-gl-style/style.json` |
| `dark_all` | `https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json` |

These are CARTO's published per-style equivalents. CARTO says the same key covers raster and vector services, and its key requirement is extending to vector basemaps. [CARTO Basemaps FAQ](https://docs.carto.com/faqs/carto-basemaps) [CARTO API-key guide](https://carto.com/basemaps/apikey/)

Do **not** rely only on that style-URL query parameter. CARTO's live style document uses absolute child URLs for its sprite, glyphs, and vector TileJSON; query parameters on the parent style URL do not carry to those requests. Create one MapLibre `transformRequest(url)` helper that, for only `basemaps.cartocdn.com` and its subdomains, appends the encoded key with `URL`/`URLSearchParams` while preserving an existing query. Pass it to every map initialization and style swap. MapLibre documents this hook for request URL rewriting. [CARTO Positron style document](https://basemaps.cartocdn.com/gl/positron-gl-style/style.json) [MapLibre Map API](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/)

The browser must receive the key because MapLibre loads the style and its map resources directly. Retain `NEXT_PUBLIC_CARTO_BASEMAPS_API_KEY` in Vercel and the Conductor `vercel env pull` setup. This is intentionally a client-visible service key, not a server secret; CARTO requires each customer to use its own key and to monitor/restrict it. Keep CARTO and OpenStreetMap attribution visible—the obligation is unchanged for vector maps. [CARTO Basemaps Terms](https://carto.com/legal/basemap-terms/) [CARTO Basemaps FAQ](https://docs.carto.com/faqs/carto-basemaps)

## Implementation shape and compatibility

- Add `maplibre-gl` and its stylesheet; remove the Leaflet and React Leaflet runtime dependencies only after the replacement passes. The existing `dynamic(..., { ssr: false })` wrapper is still appropriate: create and remove the MapLibre map in an effect tied to a container `ref`.
- This Next.js 15 application needs MapLibre's documented worker setup: add a small copy script that copies `maplibre-gl-worker.mjs` **and** `maplibre-gl-shared.mjs` from `node_modules/maplibre-gl/dist` into `next-js/public/maplibre/`, run it from `predev` and `prebuild`, then call `setWorkerUrl('/maplibre/maplibre-gl-worker.mjs')` in the client map component. MapLibre says Next's Turbopack and webpack modes otherwise omit the worker's required sibling module, leaving a mounted map that never loads tiles. [MapLibre GL JS installation guide](https://maplibre.org/maplibre-gl-js/docs/)
- Initialize the map with the current center, zoom `14`, `maxZoom: 20`, `scrollZoom: false`, and an attribution control. MapLibre accepts a style URL in the map options, supplies `NavigationControl` for zoom UI, and supports `bottom-right` control placement. [MapLibre Map options](https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MapOptions/) [MapLibre Map API](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/) [MapLibre NavigationControl](https://maplibre.org/maplibre-gl-js/docs/API/classes/NavigationControl/)
- Preserve the current mobile interaction deliberately: disable `dragPan` on mobile and retain touch zoom, rather than assuming Leaflet's `L.Browser.mobile` behavior carries over. Also prevent rotation/pitch if the present flat, north-up interaction is required; MapLibre exposes different handlers than Leaflet.
- Replace the Leaflet image marker with a MapLibre `Marker` using a custom DOM element containing the existing marker asset, and bind a `Popup` whose DOM content is created from `venueName` and the asynchronously fetched address. MapLibre officially supports markers, marker-bound popups, custom marker elements, and popup DOM nodes. [MapLibre Marker API](https://maplibre.org/maplibre-gl-js/docs/API/classes/Marker/) [MapLibre Popup API](https://maplibre.org/maplibre-gl-js/docs/API/classes/Popup/)
- On `prefers-color-scheme` changes, call `map.setStyle()` with the corresponding CARTO style URL. Reattach any style-dependent layers only if later added; the venue marker and popup are DOM overlays, not basemap style layers. The current Leaflet-specific attribution CSS must be replaced with MapLibre selectors while keeping the attribution rendered and legible in dark mode. MapLibre documents `setStyle()` as replacing the map style. [MapLibre Map API](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/)

## Risks and acceptance checks

- **WebGL availability:** vector rendering requires MapLibre GL JS and browser WebGL. Keep the existing loading shell and show a concise map-unavailable fallback when initialization errors; do not silently fall back to CARTO raster, since that prolongs use of the retiring service.
- **Theme switch:** test initial light and dark preference and a live preference change; confirm labels/background switch between Positron and Dark Matter without losing the venue marker or leaking a map instance.
- **Behavior parity:** test desktop (no wheel zoom; zoom buttons bottom-right; drag enabled) and touch/mobile (drag disabled; pinch/touch zoom enabled), coordinate centering, marker icon alignment, popup address update, and visible CARTO/OSM attribution.
- **Network/configuration:** confirm the selected `style.json`, sprite, glyph, TileJSON, and vector-tile requests all carry `key=…`, vector resources load, and a missing development variable presents the intended configuration/fallback state. CARTO's free allowance is five million tile requests per calendar month across raster and vector; it may extend the key requirement to vector in future. [CARTO Basemaps FAQ](https://docs.carto.com/faqs/carto-basemaps) [CARTO API-key guide](https://carto.com/basemaps/apikey/)

## Decision

Proceed with a focused, client-only **MapLibre GL JS** replacement when ready. It removes the dependency on CARTO's retiring raster product, preserves this component's small feature set with official MapLibre APIs, and maps the current light/dark styles exactly. Do not choose a Leaflet vector plugin unless a separate evaluation establishes a project-specific reason to accept a third-party bridge.
