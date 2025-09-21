import Link from "next/link";
import { Suspense } from "react";

import { AuthGateway } from "./sections/auth-gateway";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-slate-900/50" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm uppercase tracking-[0.2em] text-slate-400">
              AI-Powered Resume Optimization
            </span>
            <h1 className="mt-6 text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
              Never Miss Another Job Opportunity
            </h1>
            <p className="mt-6 text-xl text-slate-300 sm:text-2xl">
              Our AI agents analyze job postings and tailor your resume to beat ATS systems.
              Get higher match scores without inventing experience.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Suspense fallback={<div className="text-slate-400">Loading...</div>}>
                <AuthGateway />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-slate-300">
              Our AI system optimizes your resume in 4 intelligent steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/20 border border-blue-500/30">
                <span className="text-2xl font-bold text-blue-400">1</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Upload Resume & Job</h3>
              <p className="text-slate-300">
                Input your master resume and paste the job posting you want to apply for.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600/20 border border-purple-500/30">
                <span className="text-2xl font-bold text-purple-400">2</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">AI Analysis</h3>
              <p className="text-slate-300">
                Our ATS evaluator analyzes keyword matches and identifies missing qualifications.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600/20 border border-green-500/30">
                <span className="text-2xl font-bold text-green-400">3</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Smart Tailoring</h3>
              <p className="text-slate-300">
                AI advisor provides specific recommendations to optimize your resume for the job.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-600/20 border border-orange-500/30">
                <span className="text-2xl font-bold text-orange-400">4</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Professional Rewrite</h3>
              <p className="text-slate-300">
                Expert AI rewrites your resume using optimal keywords and phrasing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Why Choose Our AI System</h2>
            <p className="mt-4 text-lg text-slate-300">
              Advanced AI agents that work together to optimize your job applications
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="mb-4 text-3xl">🎯</div>
              <h3 className="mb-3 text-xl font-semibold text-white">ATS-Optimized</h3>
              <p className="text-slate-300">
                Mimics real ATS systems to identify and incorporate the exact keywords and phrases from job postings.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="mb-4 text-3xl">🧠</div>
              <h3 className="mb-3 text-xl font-semibold text-white">Never Invents Information</h3>
              <p className="text-slate-300">
                Only reframes and optimizes your existing experience, skills, and qualifications.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="mb-4 text-3xl">⚡</div>
              <h3 className="mb-3 text-xl font-semibold text-white">Fast & Accurate</h3>
              <p className="text-slate-300">
                Get a professionally tailored resume in minutes, not hours of manual editing.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="mb-4 text-3xl">📊</div>
              <h3 className="mb-3 text-xl font-semibold text-white">Match Scoring</h3>
              <p className="text-slate-300">
                Receive detailed match scores and recommendations for continuous improvement.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="mb-4 text-3xl">🔄</div>
              <h3 className="mb-3 text-xl font-semibold text-white">Iterative Optimization</h3>
              <p className="text-slate-300">
                Continues refining until target match scores are achieved.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="mb-4 text-3xl">💰</div>
              <h3 className="mb-3 text-xl font-semibold text-white">Pay-Per-Use</h3>
              <p className="text-slate-300">
                Credit-based system - only pay for the optimizations you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-slate-300">
              1 credit = 1 complete resume optimization. No subscriptions, no hidden fees.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                <div className="text-4xl font-bold text-blue-400 mb-4">$10</div>
                <div className="text-slate-300 mb-6">100 credits</div>
                <div className="text-sm text-slate-400">Perfect for trying out the service</div>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-500/30 bg-blue-600/10 p-8 backdrop-blur relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white">
                Most Popular
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                <div className="text-4xl font-bold text-blue-400 mb-4">$50</div>
                <div className="text-slate-300 mb-6">500 credits</div>
                <div className="text-sm text-slate-400">Best value for active job seekers</div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-blue-400 mb-4">$100</div>
                <div className="text-slate-300 mb-6">1000 credits</div>
                <div className="text-sm text-slate-400">For heavy users and teams</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Ready to Beat the ATS Systems?
          </h2>
          <p className="text-lg text-slate-300 mb-10">
            Join thousands of job seekers who have improved their resume match scores with our AI system.
          </p>
          <Suspense fallback={<div className="text-slate-400">Loading...</div>}>
            <AuthGateway />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
