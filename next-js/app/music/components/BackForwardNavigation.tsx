import { ButtonLink, Button } from "@components/Button";

interface BackForwardNavigationProps<T> {
  /**
   * The previous item to navigate to, or null if at the beginning
   */
  prev: T | null;
  /**
   * The next item to navigate to, or null if at the end
   */
  next: T | null;
  /**
   * Function to generate the href for an item
   */
  getHref: (item: T) => string;
  /**
   * Function to generate the tooltip text for an item
   */
  getTooltip: (item: T) => string;
}

export function BackForwardNavigation<T>({
  prev,
  next,
  getHref,
  getTooltip,
}: BackForwardNavigationProps<T>) {
  return (
    <div className="flex gap-2 text-2xl w-full md:w-auto">
      {prev ? (
        <ButtonLink
          href={getHref(prev)}
          title={getTooltip(prev)}
          className="flex-1 md:flex-initial flex items-center gap-2"
        >
          <span>←</span>
        </ButtonLink>
      ) : (
        <Button
          disabled
          className="flex-1 md:flex-initial flex items-center gap-2"
        >
          <span>←</span>
        </Button>
      )}

      {next ? (
        <ButtonLink
          href={getHref(next)}
          title={getTooltip(next)}
          className="flex-1 md:flex-initial flex items-center gap-2"
        >
          <span>→</span>
        </ButtonLink>
      ) : (
        <Button
          disabled
          className="flex-1 md:flex-initial flex items-center gap-2"
        >
          <span>→</span>
        </Button>
      )}
    </div>
  );
}
