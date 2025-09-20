"use client";

import Link from "next/link";

import { SignIn } from "@stackframe/stack";

export function SignedOutSection() {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="text-2xl font-semibold text-white">Try the hosted authentication flow</h2>
        <p className="mt-2 text-sm text-slate-300">
          Launch the Stack Auth handler pages to experience sign-in, sign-up, password reset, and more - no extra UI work required.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link
            className="rounded-full border border-transparent bg-green-500/90 px-4 py-2 font-medium text-white transition hover:bg-green-500"
            href="/handler/sign-up"
          >
            Create account
          </Link>
          <Link
            className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-800"
            href="/handler/sign-in"
          >
            I already have an account
          </Link>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <SignIn automaticRedirect firstTab="magic-link" />
      </div>
    </section>
  );
}
