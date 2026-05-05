# Slugifier: transliterate diacritics via NFD normalization

## Context

The Megavault Music Library has work and composer titles with diacritics: `Pärt, Arvo`, `Copland - El Salón México`, `Humperdinck - Vorspiel from Hänsel and Gretel Suite`, `Debussy - Danse sacrée et danse profane`. These flow into the site through `app/music/scripts/generate-database.ts`.

The current `slugify()` (lines 17–23) lowercases and replaces every non-`[a-z0-9]` character with hyphens. Diacritic letters fall through that regex and become hyphens, producing ugly URLs like `p-rt-arvo`, `el-sal-n-m-xico`, `h-nsel`, `sacr-e`.

The vault has just gained `Composers/Pärt, Arvo.md` and `Works/Pärt - Cantus in Memoriam Benjamin Britten.md` (GVO 2026-27 season). Without this fix those land at `p-rt-arvo` etc.

## Change

`app/music/scripts/generate-database.ts`, function `slugify()`:

```ts
function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritics (U+0300–U+036F)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}
```

NFD decomposes `ä` into `a` + combining diaeresis; the combining-mark strip then removes the diacritic, leaving `a`. Same for `é → e`, `ñ → n`, `ó → o`, `á → a`.

## Slug change table

Verified via Node REPL.

| Title                                                 | Before                                              | After                                               |
| ----------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `Pärt, Arvo`                                          | `p-rt-arvo`                                         | `part-arvo`                                         |
| `Pärt - Cantus in Memoriam Benjamin Britten`          | `p-rt-cantus-in-memoriam-benjamin-britten`          | `part-cantus-in-memoriam-benjamin-britten`          |
| `Copland - El Salón México`                           | `copland-el-sal-n-m-xico`                           | `copland-el-salon-mexico`                           |
| `Humperdinck - Vorspiel from Hänsel and Gretel Suite` | `humperdinck-vorspiel-from-h-nsel-and-gretel-suite` | `humperdinck-vorspiel-from-hansel-and-gretel-suite` |
| `Debussy - Danse sacrée et danse profane`             | `debussy-danse-sacr-e-et-danse-profane`             | `debussy-danse-sacree-et-danse-profane`             |

ASCII-only titles (`Tchaikovsky, Piotr Ilyich`, `de Falla, Manuel`, `Vaughan Williams, Ralph`) are unchanged — NFD is a no-op on already-decomposed ASCII.

## Blast radius

The diacritic pages above will change URL on the next `npm run generate-music-db`. External links to those URLs would 404 after redeploy.

Mitigation if any specific URL needs to be preserved: pin it via a `slug:` frontmatter field on the corresponding Work/Composer file in the vault before regenerating. The override is already supported by `generateSlug` (line 80, current generate-database.ts).

Default: regenerate without pinning. Personal site, low external link surface.

## Escape hatch

NFD does not decompose `ß`, `ø`, `æ`, `ł` (they're not letter+combining-mark composites). These will still hyphen-strip under the new logic. For any future title containing them, add a `slug:` frontmatter field on the Work/Composer file in the vault.

## Verification

1. `cd next-js && npm run generate-music-db`
2. `grep '"slug"' app/music/data/json/composers.json | grep part` → expect `"slug": "part-arvo"`
3. Confirm previously-ugly slugs are now clean in the regenerated JSON: search for `el-salon-mexico`, `hansel`, `sacree` — should appear; `el-sal-n-m-xico`, `h-nsel`, `sacr-e` — should not.
4. Spot-check ASCII-only slugs unchanged: `tchaikovsky-piotr-ilyich`, `de-falla-manuel`, `vaughan-williams-ralph` still present.
5. `npm run build` succeeds.

## Coordination with Megavault

This spec is paired with Megavault changes adding `Composers/Pärt, Arvo.md` and `Works/Pärt - Cantus in Memoriam Benjamin Britten.md` (GVO 2026-27 season). Order:

1. Land this slugifier fix in the site repo.
2. Pull latest Megavault.
3. Run `npm run generate-music-db`.
4. Deploy.

The two changes are independent — landing them in either order works — but the slug change for already-existing diacritic pages happens whenever the slugifier ships, regardless of the vault state.
