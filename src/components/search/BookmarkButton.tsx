import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useIsBookmarked, useAddBookmark, useRemoveBookmark } from "@/hooks/useBookmarks";
import { useNavigate } from "react-router-dom";

interface BookmarkButtonProps {
  url: string;
  title: string;
  type: "repo" | "issue";
  description?: string | null;
  language?: string | null;
  stars?: number | null;
  owner?: string | null;
  repoName?: string | null;
  issueNumber?: number | null;
  labels?: unknown;
}

export function BookmarkButton({
  url,
  title,
  type,
  description,
  language,
  stars,
  owner,
  repoName,
  issueNumber,
  labels,
}: BookmarkButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: existingBookmark, isLoading } = useIsBookmarked(url);
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/auth");
      return;
    }

    if (existingBookmark) {
      removeBookmark.mutate(existingBookmark.id);
    } else {
      addBookmark.mutate({
        title,
        url,
        type,
        description: description || null,
        language: language || null,
        stars: stars || null,
        owner: owner || null,
        repo_name: repoName || null,
        issue_number: issueNumber || null,
        labels: labels || [],
      });
    }
  };

  const isPending = addBookmark.isPending || removeBookmark.isPending;
  const isBookmarked = !!existingBookmark;

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-8 w-8 flex-shrink-0 ${
        isBookmarked
          ? "text-primary hover:text-primary/80"
          : "text-muted-foreground hover:text-foreground"
      }`}
      onClick={handleClick}
      disabled={isPending || isLoading}
      title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {isBookmarked ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
    </Button>
  );
}
