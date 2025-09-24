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
import { JobPostingsList } from "@/components/job-postings-list";
import { Briefcase, Home } from "lucide-react";
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
                      <a href={item.url} className="flex items-center gap-3 py-2">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-md">
                          <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6 flex-1 min-h-0">
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Job Postings
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex-1 overflow-y-auto">
            <JobPostingsList />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
