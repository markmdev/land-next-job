"use client";

import Link from "next/link";

import { type CurrentUser, UserButton } from "@stackframe/stack";

type AuthenticatedSectionProps = {
  user: CurrentUser;
};

export function AuthenticatedSection({ user }: AuthenticatedSectionProps) {
  const displayName = user.displayName || user.primaryEmail || "there";

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-white">You&apos;re signed in</h2>
          <p className="text-sm text-slate-300">
            Welcome back, {displayName}. Explore the handler routes or open the user menu to manage
            your account.
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link
              className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-800"
              href="/handler/account-settings"
            >
              Account settings
            </Link>
            <Link
              className="rounded-full border border-transparent bg-red-500/90 px-4 py-2 font-medium text-white transition hover:bg-red-500"
              href="/handler/sign-out"
            >
              Sign out
            </Link>
          </div>
        </div>
        <UserButton showUserInfo />
      </div>
    </section>
  );
}
