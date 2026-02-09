import { Star, GitFork, Circle, ExternalLink, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRemoveBookmark, type Bookmark } from "@/hooks/useBookmarks";

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

export function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  const removeBookmark = useRemoveBookmark();

  return (
    <div className="group p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-card transition-all duration-300">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {bookmark.type === "repo" ? (
            <GitFork className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-primary flex-shrink-0" />
          )}
          <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary uppercase">
            {bookmark.type}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => removeBookmark.mutate(bookmark.id)}
            disabled={removeBookmark.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {bookmark.owner && bookmark.repo_name && (
          <p className="text-xs text-muted-foreground font-mono mb-1">
            {bookmark.owner}/{bookmark.repo_name}
          </p>
        )}

        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {bookmark.title}
        </h3>

        {bookmark.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {bookmark.description}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          {bookmark.language && (
            <span className="flex items-center gap-1.5">
              <Circle
                className="h-3 w-3 fill-current"
                style={{ color: langColors[bookmark.language] || "#8b8b8b" }}
              />
              {bookmark.language}
            </span>
          )}
          {bookmark.stars != null && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {bookmark.stars >= 1000 ? `${(bookmark.stars / 1000).toFixed(1)}k` : bookmark.stars}
            </span>
          )}
        </div>
      </a>
    </div>
  );
}
