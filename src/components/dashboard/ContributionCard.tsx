import { type Contribution } from "@/hooks/useContributions";
import { Badge } from "@/components/ui/badge";
import { GitPullRequest, GitCommit, AlertCircle, ExternalLink, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const TYPE_CONFIG = {
  pr: { icon: GitPullRequest, label: "PR" },
  commit: { icon: GitCommit, label: "Commit" },
  issue: { icon: AlertCircle, label: "Issue" },
};

const STATE_COLORS: Record<string, string> = {
  open: "bg-primary/10 text-primary border-primary/20",
  closed: "bg-destructive/10 text-destructive border-destructive/20",
  merged: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export function ContributionCard({ contribution }: { contribution: Contribution }) {
  const config = TYPE_CONFIG[contribution.type];
  const Icon = config.icon;
  const stateClass = STATE_COLORS[contribution.state || ""] || "bg-muted text-muted-foreground";
  const timeAgo = contribution.created_at_gh
    ? formatDistanceToNow(new Date(contribution.created_at_gh), { addSuffix: true })
    : "";

  return (
    <a
      href={contribution.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-border bg-card/50 p-4 hover:border-primary/30 hover:bg-card transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 p-1.5 rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {contribution.title}
            </h4>
            <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
          <p className="text-xs text-muted-foreground mb-2">{contribution.repo_full_name}</p>
          <div className="flex items-center gap-2 flex-wrap">
            {contribution.state && (
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${stateClass}`}>
                {contribution.state}
              </Badge>
            )}
            {contribution.comments > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <MessageSquare className="h-3 w-3" /> {contribution.comments}
              </span>
            )}
            {timeAgo && (
              <span className="text-[10px] text-muted-foreground">{timeAgo}</span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
