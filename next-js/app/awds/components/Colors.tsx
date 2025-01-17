import { awdsColors } from "../../../tailwind.config";

export const Colors = () => {
  /** This is a hack because Tailwind won't generate styles for dynamically-specified classes; I'm over it, this is fine  */
  const ForceTailwindToGenerateStylesForAllTheColors = () => (
    <div
      className={[
        "bg-primary",
        "bg-secondary",
        "bg-tertiary",
        "bg-accent",
        "bg-text",
        "bg-background",
        "bg-highlight",
        "bg-muted",
        "bg-surface",
        "bg-border",
        "bg-active",
        "bg-selected",
        "dark:bg-text-dark",
        "dark:bg-background-dark",
        "dark:bg-highlight-dark",
        "dark:bg-muted-dark",
        "dark:bg-surface-dark",
        "dark:bg-border-dark",
        "dark:bg-active-dark",
        "dark:bg-selected-dark",
      ].join(" ")}
    ></div>
  );

  /** Show the color's `DEFAULT` or `dark` value, depending on screen mode */
  const ColorValue = ({ value }: { value: (typeof awdsColors)[string] }) => (
    <>
      {/* Default Value */}
      <span className={value.dark && "block dark:hidden"}>{value.DEFAULT}</span>

      {/* When in dark mode, if color has a dark value, show dark value instead */}
      {value.dark && <span className="hidden dark:block">{value.dark}</span>}
    </>
  );

  return (
    <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-1 md:gap-3">
      {Object.entries(awdsColors).map(([color, value]) => (
        <div key={color} className="grid grid-rows-2">
          <div
            className={[
              "h-12",
              "md:h-20",
              "w-full",
              "border",
              "border-highlight",
              "dark:border-muted",
              `bg-${color}`,
              `dark:bg-${color}-dark`,
            ].join(" ")}
          ></div>
          <div className="flex flex-col">
            <span>{color}</span>
            <span className="text-xs">
              <ColorValue value={value} />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
