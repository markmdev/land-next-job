"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useUser } from "@stackframe/stack";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Master Resume", href: "/dashboard/master-resume" },
  { label: "Job Hunt", href: "/dashboard_m" },
];

export function DashboardSidebar() {
  const user = useUser({ or: "return-null" });
  const pathname = usePathname();

  const displayName = user?.displayName ?? user?.primaryEmail ?? "Guest";
  const email = user?.primaryEmail ?? "guest@example.com";
  const avatarUrl = user && "photoUrl" in user ? (user as { photoUrl?: string | null }).photoUrl ?? undefined : undefined;
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const [credits, setCredits] = useState<number | null>(null);
  const [loadingCredits, setLoadingCredits] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) {
        setLoadingCredits(false);
        return;
      }

      try {
        const item = await user.getItem("credits");
        setCredits(item.quantity);
      } catch (error) {
        console.error("Failed to fetch credits:", error);
        setCredits(0); // Default to 0 on error
      } finally {
        setLoadingCredits(false);
      }
    };

    fetchCredits();
  }, [user]);

  const handlePurchaseCredits = async () => {
    if (!user) return;

    try {
      const checkoutUrl = await user.createCheckoutUrl({ offerId: "offer-2" });
      window.open(checkoutUrl, "_blank");
    } catch (error) {
      console.error("Failed to create checkout URL:", error);
    }
  };

  return (
    <aside className="hidden w-72 flex-col border-r border-white/10 bg-slate-950/80 px-6 py-8 backdrop-blur lg:flex">
      <div className="mb-10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            JobHunt
          </span>
          <Badge variant="outline" className="border-cyan-400/60 bg-cyan-400/10 text-cyan-200">
            Beta
          </Badge>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-4">
            <Avatar fallback={initials} src={avatarUrl ?? undefined} alt={displayName} />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">{displayName}</p>
              <p className="text-xs text-slate-400">{email}</p>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="uppercase tracking-wide text-slate-400">Credits</span>
              <Badge variant="success" className="bg-emerald-400/90 text-emerald-950">
                {loadingCredits ? "..." : (credits ?? 0)}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              1 credit = 1 tailoring run. Purchase more anytime in billing.
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2 text-sm">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="group">
              <span
                className={cn(
                  "flex items-center justify-between rounded-xl border border-transparent px-4 py-3 font-semibold transition",
                  isActive
                    ? "border-cyan-400/40 bg-cyan-400/10 text-white shadow-[0_0_20px_-12px_rgba(34,211,238,0.8)]"
                    : "border-white/5 bg-white/5 text-slate-300 hover:border-white/15 hover:bg-white/10 hover:text-white",
                )}
              >
                {item.label}
                {isActive && (
                  <Badge className="bg-cyan-400/80 text-slate-950">Active</Badge>
                )}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-10">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-900/30 p-5 text-xs text-slate-300">
          <p className="font-semibold text-white">Need more runs?</p>
          <p className="mt-1 text-slate-400">Upgrade to a credit bundle and unlock unlimited job experiments.</p>
          <Button
            size="sm"
            className="mt-4 w-full rounded-full bg-cyan-400/80 text-slate-950 hover:bg-cyan-300"
            onClick={handlePurchaseCredits}
          >
            Purchase credits
          </Button>
        </div>
      </div>
    </aside>
  );
}
