"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Master Resume Card */}
          <Link
            href="/dashboard/master-resume"
            className="block p-6 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl">📄</span>
              <h2 className="text-xl font-semibold text-white">Master Resume</h2>
            </div>
            <p className="text-slate-300">
              Manage your complete resume with all your experience, skills, and qualifications.
            </p>
          </Link>

          {/* Job Hunt Card */}
          <Link
            href="/dashboard/editor"
            className="block p-6 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl">🎯</span>
              <h2 className="text-xl font-semibold text-white">JOB HUNT</h2>
            </div>
            <p className="text-slate-300">
              Tailor your resume for specific job postings using AI-powered optimization.
            </p>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Credits Remaining</h3>
            <p className="text-3xl font-bold text-blue-400">100</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Resumes Optimized</h3>
            <p className="text-3xl font-bold text-green-400">0</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Success Rate</h3>
            <p className="text-3xl font-bold text-purple-400">0%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
