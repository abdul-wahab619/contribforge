import { useAuth } from "@/hooks/useAuth";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useContributions, useSyncStatus } from "@/hooks/useContributions";
import { BookmarkCard } from "./BookmarkCard";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { Bookmark, GitFork, AlertCircle, ArrowRight, GitPullRequest, GitCommit, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function DashboardOverview() {
  const { user } = useAuth();
  const { data: bookmarks, isLoading } = useBookmarks();
  const { data: contributions } = useContributions();

  const repoCount = bookmarks?.filter((b) => b.type === "repo").length ?? 0;
  const issueCount = bookmarks?.filter((b) => b.type === "issue").length ?? 0;
  const totalCount = bookmarks?.length ?? 0;
  const prCount = contributions?.filter((c) => c.type === "pr").length ?? 0;
  const commitCount = contributions?.filter((c) => c.type === "commit").length ?? 0;
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  const recentBookmarks = bookmarks?.slice(0, 6) ?? [];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Hey, {displayName} 👋
        </h2>
      <p className="text-muted-foreground mt-1">
          Here's an overview of your saved open source projects.
        </p>
      </div>
      {user?.user_metadata?.user_name && (
        <Link to={`/u/${user.user_metadata.user_name}`}>
          <Button variant="hero" size="lg" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            View Portfolio
          </Button>
        </Link>
      )}

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-xl border border-border bg-card/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bookmark className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total Bookmarks</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{totalCount}</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <GitFork className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Repositories</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{repoCount}</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <AlertCircle className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Issues</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{issueCount}</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <GitPullRequest className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Pull Requests</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{prCount}</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <GitCommit className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Commits</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{commitCount}</p>
        </div>
      </div>

      {/* Activity Heatmap */}
      <ActivityHeatmap />

      {/* Recent Bookmarks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Bookmarks</h3>
          {totalCount > 6 && (
            <Link to="/dashboard/bookmarks">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 rounded-xl border border-border bg-card/50 animate-pulse" />
            ))}
          </div>
        ) : recentBookmarks.length === 0 ? (
          <div className="text-center py-16 rounded-xl border border-dashed border-border">
            <Bookmark className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-base font-medium text-foreground mb-1">No bookmarks yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Search for repositories and issues to start bookmarking.
            </p>
            <Link to="/search">
              <Button size="sm">Start Searching</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentBookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
