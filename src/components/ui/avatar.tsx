import * as React from "react";

import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-800 text-base font-semibold text-slate-200",
        className,
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? fallback ?? "User avatar"} className="h-full w-full object-cover" />
      ) : (
        <span className="uppercase">{fallback?.slice(0, 2) ?? "??"}</span>
      )}
    </div>
  ),
);
Avatar.displayName = "Avatar";

export { Avatar };
