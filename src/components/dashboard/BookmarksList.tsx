import { useBookmarks } from "@/hooks/useBookmarks";
import { BookmarkCard } from "./BookmarkCard";
import { Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BookmarksListProps {
  filterType?: "repo" | "issue";
}

export function BookmarksList({ filterType }: BookmarksListProps) {
  const { data: bookmarks, isLoading } = useBookmarks(filterType);

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 rounded-xl border border-border bg-card/50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!bookmarks || bookmarks.length === 0) {
    const label = filterType === "repo" ? "repositories" : filterType === "issue" ? "issues" : "bookmarks";
    return (
      <div className="text-center py-20 rounded-xl border border-dashed border-border">
        <Bookmark className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-base font-medium text-foreground mb-1">No {label} saved</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Search for projects and bookmark them to see them here.
        </p>
        <Link to="/search">
          <Button size="sm">Search Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  );
}
