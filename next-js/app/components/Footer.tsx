import NextLink from "next/link";

const socialAccounts = [
  {
    icon: "instagram",
    username: "expandrew",
    url: "https://instagram.com/expandrew",
  },
  {
    icon: "instagram",
    username: "antiperformances",
    url: "https://instagram.com/antiperformances",
  },
  {
    icon: "github",
    username: "andrewwestling",
    url: "https://github.com/andrewwestling",
  },
  {
    icon: "linkedin",
    username: "andrewwestling",
    url: "https://linkedin.com/in/andrewwestling",
  },
  {
    icon: "lastfm",
    username: "andwest",
    url: "https://last.fm/user/andwest",
  },
  {
    icon: "spotify",
    username: "1283883",
    url: "https://open.spotify.com/user/1283883",
  },
];

export const Footer = () => {
  return (
    <footer className="no-print flex-0 leading-loose text-sm block bg-highlight dark:bg-highlight-dark py-8 mt-12">
      <div className="max-w-container mx-auto w-full px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="mb-3">
            <span className="block text-muted dark:text-muted-dark">
              Andrew M Westling
            </span>
            <span className="block text-muted dark:text-muted-dark">
              Brooklyn, NY
            </span>
            <span className="block text-muted dark:text-muted-dark">
              <a href="mailto:hi@andrewwestling.com">hi@andrewwestling.com</a>
            </span>
            <span className="block text-muted dark:text-muted-dark">
              <NextLink href="/projects">Projects</NextLink>
            </span>
            <span className="block text-muted dark:text-muted-dark">
              <NextLink href="/resume">Resume</NextLink>
            </span>
            <span className="block text-highlight dark:text-highlight-dark">
              <NextLink href="/awds">AWDS</NextLink>
            </span>
          </div>
          <div>
            {socialAccounts.map((account) => (
              <a
                key={account.url}
                className="flex flex-row items-center text-muted dark:text-muted-dark w-fit"
                href={account.url}
              >
                <svg width={20} height={20} fill={"currentColor"}>
                  <use
                    xlinkHref={`/assets/minima-social-icons.svg#${account.icon}`}
                  ></use>
                </svg>
                <span className="block ml-2">{account.username}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
