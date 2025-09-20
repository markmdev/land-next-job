import Link from "next/link";
import { Suspense } from "react";

import { AuthGateway } from "./sections/auth-gateway";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-6 py-16">
        <header className="flex flex-col items-start gap-3">
          <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">
            Stack Auth demo
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Add frictionless authentication to your Next.js app
          </h1>
          <p className="max-w-xl text-base text-slate-300 sm:text-lg">
            This starter integrates Stack Auth&apos;s hosted flows. Update your environment
            keys and try the sign-in experience in seconds.
          </p>
        </header>

        <Suspense fallback={<div className="text-slate-400">Checking session...</div>}>
          <AuthGateway />
        </Suspense>

        <footer className="mt-auto flex flex-wrap gap-3 text-sm text-slate-400">
          <Link className="underline decoration-slate-600 decoration-dashed underline-offset-4 hover:text-slate-200" href="https://app.stack-auth.com/projects" target="_blank" rel="noreferrer">
            Create your Stack project
          </Link>
          <Link className="underline decoration-slate-600 decoration-dashed underline-offset-4 hover:text-slate-200" href="/handler/account-settings">
            Account settings
          </Link>
        </footer>
      </div>
    </main>
  );
}
