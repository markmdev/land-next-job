"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { type CurrentUser } from "@stackframe/stack";

type AuthenticatedSectionProps = {
  user: CurrentUser;
};

export function AuthenticatedSection({ user }: AuthenticatedSectionProps) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after successful authentication
    router.push("/dashboard_m");
  }, [router]);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-white">Redirecting...</h2>
          <p className="text-sm text-slate-300">
            Welcome back! Taking you to your dashboard...
          </p>
        </div>
      </div>
    </section>
  );
}
