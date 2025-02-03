import { ReactNode } from "react";

export const VariantWrapper = (
  props: React.PropsWithChildren & {
    label: string;
    meta?: ReactNode;
    className?: string;
  }
) => (
  <div className={`flex flex-col gap-2 min-w-0 ${props.className}`}>
    <div className="flex flex-col gap-1">
      <label
        className={`${
          props.className?.includes("border-t" || "border") ? "mt-[-1px]" : ""
        } text-xs rounded border border-fuchsia-500 border-dashed text-fuchsia-500 px-1 w-fit`}
      >
        {props.label}
      </label>
      {props.meta && <label className="text-xs text-muted">{props.meta}</label>}
    </div>
    {props.children}
  </div>
);
