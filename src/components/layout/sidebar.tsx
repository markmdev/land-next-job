"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type CurrentUser, UserButton } from "@stackframe/stack";

type SidebarProps = {
  user: CurrentUser;
};

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const displayName = user.displayName || user.primaryEmail || "User";

  const navigation = [
    {
      name: "Master Resume",
      href: "/dashboard/master-resume",
      icon: "📄",
    },
    {
      name: "JOB HUNT",
      href: "/dashboard/editor",
      icon: "🎯",
    },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* User Profile Section */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <UserButton showUserInfo={false} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {displayName}
            </p>
            <p className="text-xs text-slate-400">Credits: 100</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <Link
          href="/handler/sign-out"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <span className="text-lg">🚪</span>
          Sign Out
        </Link>
      </div>
    </div>
  );
}
