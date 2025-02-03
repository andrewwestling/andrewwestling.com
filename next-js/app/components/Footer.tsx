import NextLink from "next/link";

const socialAccounts = [
  {
    title: "GitHub",
    icon: "github",
    username: "andrewwestling",
    url: "https://github.com/andrewwestling",
  },
  {
    title: "LinkedIn",
    icon: "linkedin",
    username: "andrewwestling",
    url: "https://linkedin.com/in/andrewwestling",
  },
  {
    title: "Bluesky",
    icon: "bluesky",
    username: "@andrewwestling.com",
    url: "https://bsky.app/profile/andrewwestling.com",
  },
  {
    title: "Instagram",
    icon: "instagram",
    username: "expandrew",
    url: "https://instagram.com/expandrew",
  },
  {
    title: "Last.fm",
    icon: "lastfm",
    username: "andwest",
    url: "https://last.fm/user/andwest",
  },
  {
    title: "Spotify",
    icon: "spotify",
    username: "1283883",
    url: "https://open.spotify.com/user/1283883",
  },
];

export const Footer = () => {
  const footerLinkClasses =
    "flex gap-2 text-muted dark:text-muted-dark w-fit hover:text-primary";

  const awdsLinkClasses =
    "flex gap-2 text-highlight dark:text-highlight-dark no-underline w-fit hover:text-primary group select-none";

  return (
    <footer className="print:hidden flex-0 leading-loose text-sm block bg-highlight dark:bg-highlight-dark py-8 mt-12">
      <div className="max-w-container mx-auto w-full px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="mb-3">
            <span className="flex gap-2 items-center text-muted dark:text-muted-dark">
              <span>👋</span>
              <span>Andrew M Westling</span>
              <span className="text-xs">(he/him)</span>
            </span>
            <span className="flex gap-2 items-center text-muted dark:text-muted-dark">
              <span>📍</span>
              <span>Brooklyn, NY</span>
            </span>

            <a
              href="mailto:hi@andrewwestling.com"
              className={["no-underline", footerLinkClasses].join(" ")}
            >
              <span className="no-underline">✉️</span>
              <span className="underline">hi@andrewwestling.com</span>
            </a>

            <NextLink href="/projects" className={footerLinkClasses}>
              <span className="underline">Projects</span>
            </NextLink>

            <NextLink href="/resume" className={footerLinkClasses}>
              <span className="underline">Resume</span>
            </NextLink>

            <NextLink href="/music" className={footerLinkClasses}>
              Music Library
            </NextLink>

            <NextLink href="/awds" className={awdsLinkClasses}>
              <span className="no-underline opacity-0 group-hover:opacity-100">
                📐
              </span>
              <span className="underline">AWDS</span>
            </NextLink>
          </div>
          <div>
            {socialAccounts.map((account) => (
              <a
                key={account.url}
                className="flex gap-2 items-center text-muted dark:text-muted-dark w-fit hover:text-primary"
                href={account.url}
                title={`${account.username} on ${account.title}`}
              >
                <svg width={20} height={20} fill={"currentColor"}>
                  <use
                    xlinkHref={`/assets/minima-social-icons.svg#${account.icon}`}
                  ></use>
                </svg>
                <span className="block">{account.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
