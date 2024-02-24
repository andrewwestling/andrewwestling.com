export const Button = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) => (
  <button
    className="my-8 m-0 min-w-0 inline-block text-center leading-inherit no-underline rounded text-sm py-2 px-4 text-muted dark:text-muted-dark bg-highlight dark:bg-highlight-dark hover:bg-muted hover:text-highlight hover:dark:bg-muted-dark hover:dark:text-highlight-dark border border-muted border-solid"
    {...props}
  />
);

export const ButtonLink = (
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>
) => (
  <a
    className="my-8 m-0 min-w-0 inline-block text-center leading-inherit no-underline rounded text-sm py-2 px-4 text-muted dark:text-muted-dark bg-highlight dark:bg-highlight-dark hover:bg-muted hover:text-highlight hover:dark:bg-muted-dark hover:dark:text-highlight-dark border border-muted border-solid"
    {...props}
  />
);
