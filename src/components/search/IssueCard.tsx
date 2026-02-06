import { MessageSquare, ExternalLink } from "lucide-react";
import type { GitHubIssue } from "@/lib/github";
import { extractRepoFromUrl } from "@/lib/github";

interface IssueCardProps {
  issue: GitHubIssue;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function IssueCard({ issue }: IssueCardProps) {
  const repoName = extractRepoFromUrl(issue.repository_url);

  return (
    <a
      href={issue.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-card transition-all duration-300"
    >
      {/* Repo name */}
      <p className="text-xs text-muted-foreground mb-2 font-mono">{repoName}</p>

      {/* Title */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-relaxed">
          {issue.title}
        </h3>
        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
      </div>

      {/* Labels */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {issue.labels.slice(0, 4).map((label) => (
          <span
            key={label.id}
            className="px-2 py-0.5 text-xs rounded-md font-medium"
            style={{
              backgroundColor: `#${label.color}20`,
              color: `#${label.color}`,
              border: `1px solid #${label.color}40`,
            }}
          >
            {label.name}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <img
            src={issue.user.avatar_url}
            alt={issue.user.login}
            className="h-4 w-4 rounded-full"
          />
          {issue.user.login}
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          {issue.comments}
        </span>
        <span className="ml-auto">opened {timeAgo(issue.created_at)}</span>
      </div>
    </a>
  );
}
