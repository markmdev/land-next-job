import * as React from "react";

import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "success" | "warning" | "danger";
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "border-transparent bg-slate-800/90 text-slate-200",
  outline: "border-slate-600/60 text-slate-200",
  success: "border-transparent bg-emerald-500/90 text-emerald-950",
  warning: "border-transparent bg-amber-400/90 text-amber-950",
  danger: "border-transparent bg-rose-500/90 text-rose-50",
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  ),
);
Badge.displayName = "Badge";

export { Badge };
