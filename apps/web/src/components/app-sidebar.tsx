import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home } from "lucide-react";
import { JobPostingsSection } from "./job-postings-section";
// Menu items.
const items = [
  {
    title: "Master Resume",
    url: "/",
    icon: Home,
  },
];
export function AppSidebar() {
  return (
    <Sidebar className="border-r-2 border-gray-200 dark:border-gray-700">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors duration-200"
                    >
                      <Link href={item.url} className="flex items-center gap-3 py-2">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-md">
                          <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6 flex-1 min-h-0">
          <JobPostingsSection />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
