import { useParams, Link } from "react-router-dom";
import { usePublicProfile, usePublicContributions, usePublicActivity } from "@/hooks/usePublicProfile";
import { PortfolioHeatmap } from "@/components/portfolio/PortfolioHeatmap";
import { PortfolioBadges } from "@/components/portfolio/PortfolioBadges";
import { ContributionCard } from "@/components/dashboard/ContributionCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GitPullRequest, GitCommit, AlertCircle, ExternalLink, Calendar,
  ArrowLeft, Share2, Github
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export default function Portfolio() {
  const { username } = useParams<{ username: string }>();
  const { data: profile, isLoading: profileLoading } = usePublicProfile(username || "");
  const { data: contributions, isLoading: contribLoading } = usePublicContributions(profile?.id);
  const { data: activity, isLoading: activityLoading } = usePublicActivity(profile?.id);

  const isLoading = profileLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">User not found</h1>
        <p className="text-muted-foreground">No portfolio exists for "{username}".</p>
        <Link to="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  const prs = contributions?.filter((c) => c.type === "pr") || [];
  const commits = contributions?.filter((c) => c.type === "commit") || [];
  const issues = contributions?.filter((c) => c.type === "issue") || [];
  const repos = new Set(contributions?.map((c) => c.repo_full_name) || []);
  const memberSince = formatDistanceToNow(new Date(profile.created_at), { addSuffix: true });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Portfolio link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between h-14 px-6">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">ContribForge</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleShare} className="gap-2">
              <Share2 className="h-3.5 w-3.5" /> Share
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <Avatar className="h-20 w-20 border-2 border-border">
            <AvatarImage src={profile.avatar_url || `https://github.com/${username}.png`} />
            <AvatarFallback className="text-2xl">{(profile.display_name || username)?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              {profile.display_name || username}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" /> @{username}
                <ExternalLink className="h-3 w-3" />
              </a>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" /> Joined {memberSince}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={GitPullRequest} label="Pull Requests" value={prs.length} />
          <StatCard icon={GitCommit} label="Commits" value={commits.length} />
          <StatCard icon={AlertCircle} label="Issues" value={issues.length} />
          <StatCard icon={Github} label="Repos" value={repos.size} />
        </div>

        {/* Activity Heatmap */}
        <section className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Contribution Activity</h2>
          <PortfolioHeatmap activity={activity} isLoading={activityLoading} />
        </section>

        {/* Badges */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Badges</h2>
          <PortfolioBadges contributions={contributions || []} />
        </section>

        {/* Recent Contributions */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Contributions</h2>
          {contribLoading ? (
            <div className="grid md:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 rounded-xl border border-border bg-card/50 animate-pulse" />
              ))}
            </div>
          ) : contributions && contributions.length > 0 ? (
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All ({contributions.length})</TabsTrigger>
                <TabsTrigger value="prs">PRs ({prs.length})</TabsTrigger>
                <TabsTrigger value="commits">Commits ({commits.length})</TabsTrigger>
                <TabsTrigger value="issues">Issues ({issues.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <ContribGrid items={contributions.slice(0, 20)} />
              </TabsContent>
              <TabsContent value="prs">
                <ContribGrid items={prs.slice(0, 20)} />
              </TabsContent>
              <TabsContent value="commits">
                <ContribGrid items={commits.slice(0, 20)} />
              </TabsContent>
              <TabsContent value="issues">
                <ContribGrid items={issues.slice(0, 20)} />
              </TabsContent>
            </Tabs>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">No contributions synced yet.</p>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Powered by <Link to="/" className="text-primary hover:underline">ContribForge</Link>
      </footer>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number }) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card/50 text-center">
      <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ContribGrid({ items }: { items: any[] }) {
  if (items.length === 0) return <p className="text-sm text-muted-foreground py-8 text-center">None in this category.</p>;
  return (
    <div className="grid md:grid-cols-2 gap-3 mt-4">
      {items.map((c) => <ContributionCard key={c.id} contribution={c} />)}
    </div>
  );
}
