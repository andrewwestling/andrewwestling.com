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
    <div className="flex gap-2 text-2xl">
      {prev ? (
        <ButtonLink href={getHref(prev)} title={getTooltip(prev)}>
          ←
        </ButtonLink>
      ) : (
        <Button disabled>←</Button>
      )}

      {next ? (
        <ButtonLink href={getHref(next)} title={getTooltip(next)}>
          →
        </ButtonLink>
      ) : (
        <Button disabled>→</Button>
      )}
    </div>
  );
}
