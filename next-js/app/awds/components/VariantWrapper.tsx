import { ReactNode } from "react";

export const VariantWrapper = (
  props: React.PropsWithChildren & { label: string; meta?: ReactNode }
) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs rounded border border-fuchsia-500 border-dashed text-fuchsia-500 px-1 w-fit">
      {props.label}
    </label>
    {props.meta && (
      <label className="text-xs text-fuchsia-500">{props.meta}</label>
    )}
    {props.children}
  </div>
);
