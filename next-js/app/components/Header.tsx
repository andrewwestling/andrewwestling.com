import { HomeIcon } from "@components/HomeIcon";

export const Header = ({ children }: { children: React.ReactNode }) => {
  let toRender = children;

  if (!children) {
    toRender = <HomeIcon noHover />;
  }

  return (
    <header
      role="banner"
      className="print:hidden flex items-center border-solid border-t-4 border-t-primary border-b border-b-highlight dark:border-b-highlight-dark min-h-[56px]"
    >
      <div className="max-w-container mx-auto w-full px-4">
        <div className="flex items-center">{toRender}</div>
      </div>
    </header>
  );
};
