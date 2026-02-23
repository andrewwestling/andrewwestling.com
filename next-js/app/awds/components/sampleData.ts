// Use a date 2 days in the future so isToday() returns false and isUpcoming() returns true
const upcomingDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();

export const sampleConcertWithTitle = {
  slug: "200001011200",
  type: "concert",
  path: "Concerts/2000/200001011200 Greenwich Village Orchestra (Fall Concert).md",
  title: "200001011200 Greenwich Village Orchestra (Fall Concert)",
  content: "",
  frontmatter: {
    date: "2000-01-01T12:00:00.000Z",
    group: "Greenwich Village Orchestra",
    works: ["Sibelius - Symphony No. 1 in E Minor"],
    conductor: ["Barbara Yahr"],
    spotifyPlaylistUrl: null,
    venue: "All Saints Church",
    ticketUrl: "https://gvo.org",
  },
};

export const sampleConcertWithoutTitle = {
  slug: "200002021200",
  type: "concert",
  path: "Concerts/2000/200002021200 Greenwich Village Orchestra.md",
  title: "200002021200 Greenwich Village Orchestra",
  content: "",
  frontmatter: {
    date: "2000-02-02T12:00:00.000Z",
    group: "Greenwich Village Orchestra",
    works: ["Sibelius - Symphony No. 1 in E Minor"],
    conductor: ["Barbara Yahr"],
    spotifyPlaylistUrl: null,
    venue: "All Saints Church",
    ticketUrl: "https://gvo.org",
  },
};

export const sampleConcertWithUpcomingDate = {
  ...sampleConcertWithTitle,
  frontmatter: {
    ...sampleConcertWithTitle.frontmatter,
    date: upcomingDate,
  },
};

export const sampleConcertWithTicketUrl = {
  ...sampleConcertWithTitle,
  frontmatter: {
    ...sampleConcertWithTitle.frontmatter,
    date: upcomingDate,
    ticketUrl: "/awds",
  },
};

export const sampleConcertWithoutTicketUrl = {
  ...sampleConcertWithTitle,
  frontmatter: {
    ...sampleConcertWithTitle.frontmatter,
    date: upcomingDate,
    ticketUrl: undefined,
  },
};

export const sampleConcertWithLiveStreamUrl = {
  ...sampleConcertWithTitle,
  frontmatter: {
    ...sampleConcertWithTitle.frontmatter,
    date: upcomingDate,
    ticketUrl: undefined,
    liveStreamUrl: "/awds",
  },
};

export const sampleGroup = {
  title: "Greenwich Village Orchestra",
  slug: "gvo",
  path: "Groups/Greenwich Village Orchestra.md",
  content: "",
  frontmatter: {},
};

export const sampleSeason = {
  slug: "2020-2021",
  title: "2020-2021",
  concertSlugs: ["202105151500"],
  workSlugs: ["sibelius-symphony-no-1-in-e-minor"],
};

export const sampleSeasonNoConcerts = {
  slug: "2000-2001",
  title: "2000-2001",
  concertSlugs: [],
  workSlugs: [],
};

export const sampleConcertForNav = {
  slug: "202411171500",
  title: "202411171500 Concert - Sample Orchestra (Sample Concert)",
  frontmatter: {
    date: "2024-11-17T15:00:00.000Z",
    group: "Sample Orchestra",
  },
};

// Special version of the concert for navigation demo that uses # links
export const sampleConcertForNavPrev = {
  slug: "#prev",
  title: "Previous Concert Example",
  frontmatter: {
    date: "2024-10-17T15:00:00.000Z",
    group: "Sample Orchestra",
  },
};

export const sampleConcertForNavNext = {
  slug: "#next",
  title: "Next Concert Example",
  frontmatter: {
    date: "2024-12-17T15:00:00.000Z",
    group: "Sample Orchestra",
  },
};
