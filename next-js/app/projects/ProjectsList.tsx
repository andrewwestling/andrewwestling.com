import { ExternalLink } from "@components/ExternalLink";

/** List of projects on both Projects Page and the Homepage */
export function ProjectsList() {
  return (
    <>
      <ul className="list-revert ps-10 p-0">
        <li>
          📻 <a href="/projects/tidbyt">Tidbyt apps</a> for WQXR, WNYC, All
          Classical Radio, and BBC Sounds
        </li>
        <li>
          📦 <a href="/projects/media-cube">Media Cube</a>, a cabinet for
          displaying meaningful media objects
        </li>
        <li>
          🎻{" "}
          <ExternalLink href="https://instagram.com/antiperformances">
            anti-performances
          </ExternalLink>
          , my violinstagram
        </li>
        <li>
          🎻 Music Library, my archive of all the concerts and works I&apos;ve
          ever performed —{" "}
          <a href="/projects/music-library">Read about it</a> ·{" "}
          <a href="/music">Browse</a>
        </li>
      </ul>
    </>
  );
}
