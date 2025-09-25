import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Resume-Fit | Tailor Your Resume to Any Job",
  description:
    "Adapt your resume to specific job postings with Resume-Fit's intelligent matching system",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-950`}
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <SidebarTrigger className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" />
              <div className="flex items-center gap-2 ml-2">
                <div className="h-6 w-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                  <span className="text-white text-xs font-bold">RF</span>
                </div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Resume-Fit.
                </h1>
              </div>
            </header>
            <main className="flex flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
