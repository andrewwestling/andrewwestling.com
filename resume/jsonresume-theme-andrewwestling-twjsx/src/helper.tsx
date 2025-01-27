import { ReactNode } from "react";
import md from "markdown-it";
import * as iso from "iso-3166-1";
import moment from "moment";

const mdToHtml = (string?: string): ReactNode => {
  return string ? (
    <span dangerouslySetInnerHTML={{ __html: md().render(string) }} />
  ) : null;
};

const calcLocation = (location?: {
  city?: string;
  region?: string;
  countryCode?: string;
}): string | null => {
  const array: string[] = [];
  if (!location) {
    return null;
  }
  if (location.city) {
    array.push(location.city);
  }
  if (location.region) {
    array.push(location.region);
  }
  if (location.countryCode) {
    const country = iso.whereAlpha2(location.countryCode);
    array.push(
      country && array.length < 2 ? country.country : location.countryCode
    );
  }
  return array.length > 0 ? array.join(", ") : null;
};

const calcDate = (date?: string, format = "MMMM YYYY"): string | null => {
  return date ? beautifyDate(date, format) : null;
};

const calcDateRange = (start?: string, end?: string): string | null => {
  const array: string[] = [];
  const startDate = calcDate(start);
  const endDate = calcDate(end);
  if (startDate && endDate) {
    array.push(startDate, endDate);
  } else if (startDate) {
    array.push(startDate, "Present");
  } else if (endDate) {
    array.push(endDate);
  } else {
    return null;
  }
  return array.join(" – ");
};

const calcYearRange = (start?: string, end?: string): string | null => {
  const array: string[] = [];
  const startDate = calcDate(start, "YYYY");
  const endDate = calcDate(end, "YYYY");
  if (startDate && endDate) {
    array.push(startDate, endDate);
  } else if (startDate) {
    array.push(startDate, "Present");
  } else if (endDate) {
    array.push(endDate);
  } else {
    return null;
  }
  return array.join("–");
};

const beautifyDate = (date: string, format = "MMMM YYYY"): string =>
  moment(date, "YYYY-MM-DD").format(format);

const beautifyArray = (
  separator: string,
  array: (string | undefined)[]
): string => array.filter((x) => x).join(separator);

const arrayToPhrase = (array: string[]): string => {
  let str = "";
  const a = array.filter((x) => x);
  if (a.length === 1) {
    str = a[0];
  } else if (a.length === 2) {
    str = a.join(" and ");
  } else if (a.length > 2) {
    str = a.slice(0, -1).join(", ") + " and " + a.slice(-1);
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const beautifyLink = (url: string): ReactNode => {
  let formattedUrl = url.trim().replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");
  formattedUrl = formattedUrl.endsWith("/")
    ? formattedUrl.slice(0, -1)
    : formattedUrl;
  const urlParts = formattedUrl.split("/");
  urlParts[0] = `<strong>${urlParts[0]}</strong>`;
  return <span dangerouslySetInnerHTML={{ __html: urlParts.join("/") }} />;
};

export {
  mdToHtml,
  calcLocation,
  calcDate,
  calcDateRange,
  calcYearRange,
  beautifyDate,
  beautifyArray,
  arrayToPhrase,
  beautifyLink,
};
