import * as React from "react";

import { cn } from "@/lib/utils";

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, className, ...props }, ref) => (
    <button
      ref={ref}
      role="switch"
      aria-checked={checked}
      type="button"
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-white/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 disabled:cursor-not-allowed disabled:opacity-40",
        checked ? "bg-cyan-400/80" : "bg-slate-700",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition",
          checked ? "translate-x-5" : "translate-x-1",
        )}
      />
    </button>
  ),
);
Switch.displayName = "Switch";
