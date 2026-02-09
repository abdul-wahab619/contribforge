import { Star, GitFork, Circle, ExternalLink } from "lucide-react";
import type { GitHubRepo } from "@/lib/github";
import { BookmarkButton } from "./BookmarkButton";

interface RepoCardProps {
  repo: GitHubRepo;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
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

const langColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572a5",
  Java: "#b07219",
  Go: "#00add8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  Ruby: "#701516",
  PHP: "#4f5d95",
  Swift: "#f05138",
  Kotlin: "#a97bff",
  "C#": "#178600",
};

export function RepoCard({ repo }: RepoCardProps) {
  return (
    <div className="group block p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-card transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 min-w-0 flex-1"
        >
          <img
            src={repo.owner.avatar_url}
            alt={repo.owner.login}
            className="h-8 w-8 rounded-lg flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {repo.full_name}
            </h3>
          </div>
        </a>
        <div className="flex items-center gap-1">
          <BookmarkButton
            url={repo.html_url}
            title={repo.full_name}
            type="repo"
            description={repo.description}
            language={repo.language}
            stars={repo.stargazers_count}
            owner={repo.owner.login}
            repoName={repo.name}
          />
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
        {repo.description || "No description available."}
      </p>

      {/* Topics */}
      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="px-2 py-0.5 text-xs rounded-md bg-primary/10 text-primary"
            >
              {topic}
            </span>
          ))}
          {repo.topics.length > 4 && (
            <span className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground">
              +{repo.topics.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Footer Stats */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <Circle
              className="h-3 w-3 fill-current"
              style={{ color: langColors[repo.language] || "#8b8b8b" }}
            />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3" />
          {formatCount(repo.stargazers_count)}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="h-3 w-3" />
          {formatCount(repo.forks_count)}
        </span>
        <span className="ml-auto">{timeAgo(repo.updated_at)}</span>
      </div>
    </div>
  );
}
