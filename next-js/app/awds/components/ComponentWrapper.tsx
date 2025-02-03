export const ComponentWrapper = (props: React.PropsWithChildren) => (
  <div className="border-highlight dark:border-highlight-dark border-solid border rounded min-w-0 p-4 my-3">
    {props.children}
  </div>
);
