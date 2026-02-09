import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { BookmarksList } from "@/components/dashboard/BookmarksList";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Dashboard() {
  const location = useLocation();
  const path = location.pathname;

  const renderContent = () => {
    if (path === "/dashboard/bookmarks") return <BookmarksList />;
    if (path === "/dashboard/repos") return <BookmarksList filterType="repo" />;
    if (path === "/dashboard/issues") return <BookmarksList filterType="issue" />;
    return <DashboardOverview />;
  };

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-6 justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-sm font-semibold text-foreground">
              {path === "/dashboard/bookmarks" && "All Bookmarks"}
              {path === "/dashboard/repos" && "Saved Repositories"}
              {path === "/dashboard/issues" && "Saved Issues"}
              {path === "/dashboard" && "Dashboard"}
            </h1>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
