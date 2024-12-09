const BASE_PATH = "/music";

export const routes = {
  home: () => BASE_PATH,
  concerts: {
    index: () => `${BASE_PATH}/concerts`,
    show: (slug: string) => `${BASE_PATH}/concerts/${slug}`,
  },
  composers: {
    index: () => `${BASE_PATH}/composers`,
    show: (slug: string) => `${BASE_PATH}/composers/${slug}`,
  },
  conductors: {
    index: () => `${BASE_PATH}/conductors`,
    show: (slug: string) => `${BASE_PATH}/conductors/${slug}`,
  },
  groups: {
    index: () => `${BASE_PATH}/groups`,
    show: (slug: string) => `${BASE_PATH}/groups/${slug}`,
  },
  venues: {
    index: () => `${BASE_PATH}/venues`,
    show: (slug: string) => `${BASE_PATH}/venues/${slug}`,
  },
  works: {
    index: () => `${BASE_PATH}/works`,
    show: (slug: string) => `${BASE_PATH}/works/${slug}`,
  },
} as const;
