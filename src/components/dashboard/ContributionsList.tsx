import { useContributions, useSyncContributions, useSyncStatus } from "@/hooks/useContributions";
import { ContributionCard } from "./ContributionCard";
import { Button } from "@/components/ui/button";
import { RefreshCw, GitPullRequest, GitCommit, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ContributionsList() {
  const { data: allContributions, isLoading } = useContributions();
  const { data: syncStatus } = useSyncStatus();
  const syncMutation = useSyncContributions();

  const prs = allContributions?.filter((c) => c.type === "pr") || [];
  const commits = allContributions?.filter((c) => c.type === "commit") || [];
  const issues = allContributions?.filter((c) => c.type === "issue") || [];

  const lastSynced = syncStatus?.last_synced_at
    ? formatDistanceToNow(new Date(syncStatus.last_synced_at), { addSuffix: true })
    : "Never";

  return (
    <div className="space-y-6">
      {/* Sync bar */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Last synced: {lastSynced}
        </div>
        <Button
          size="sm"
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
          className="gap-2"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${syncMutation.isPending ? "animate-spin" : ""}`} />
          {syncMutation.isPending ? "Syncing..." : "Sync Now"}
        </Button>
      </div>

      {/* Heatmap */}
      <ActivityHeatmap />

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card/50">
          <div className="flex items-center gap-2 mb-1">
            <GitPullRequest className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Pull Requests</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{prs.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card/50">
          <div className="flex items-center gap-2 mb-1">
            <GitCommit className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Commits</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{commits.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card/50">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Issues</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{issues.length}</p>
        </div>
      </div>

      {/* Tabbed list */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({allContributions?.length || 0})</TabsTrigger>
          <TabsTrigger value="prs">PRs ({prs.length})</TabsTrigger>
          <TabsTrigger value="commits">Commits ({commits.length})</TabsTrigger>
          <TabsTrigger value="issues">Issues ({issues.length})</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-3 mt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl border border-border bg-card/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="all">
              <ContributionGrid items={allContributions || []} />
            </TabsContent>
            <TabsContent value="prs">
              <ContributionGrid items={prs} />
            </TabsContent>
            <TabsContent value="commits">
              <ContributionGrid items={commits} />
            </TabsContent>
            <TabsContent value="issues">
              <ContributionGrid items={issues} />
            </TabsContent>
          </>
        )}
      </Tabs>

      {!isLoading && (!allContributions || allContributions.length === 0) && (
        <div className="text-center py-16 rounded-xl border border-dashed border-border">
          <GitPullRequest className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-base font-medium text-foreground mb-1">No contributions yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Link your GitHub username in Profile Settings, then click "Sync Now" to fetch your contributions.
          </p>
          <Link to="/dashboard/profile">
            <Button size="sm">Go to Profile Settings</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function ContributionGrid({ items }: { items: any[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">No contributions in this category.</p>
    );
  }
  return (
    <div className="grid md:grid-cols-2 gap-3 mt-4">
      {items.map((c) => (
        <ContributionCard key={c.id} contribution={c} />
      ))}
    </div>
  );
}
