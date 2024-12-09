export const ComponentWrapper = (props: React.PropsWithChildren) => (
  <div className="border-highlight dark:border-highlight-dark border-solid border rounded w-full p-4 my-3">
    {props.children}
  </div>
);
