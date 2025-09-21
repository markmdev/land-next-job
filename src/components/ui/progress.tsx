import * as React from "react";

import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-slate-800/80",
        className,
      )}
      {...props}
    >
      <div
        className="absolute inset-y-0 left-0 w-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500"
        style={{ transform: `translateX(-${100 - Math.max(0, Math.min(100, value))}%)` }}
      />
    </div>
  ),
);
Progress.displayName = "Progress";

export { Progress };
