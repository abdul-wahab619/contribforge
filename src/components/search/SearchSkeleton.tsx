import { Loader2 } from "lucide-react";

interface SearchResultsSkeletonProps {
  count?: number;
}

export function SearchResultsSkeleton({ count = 6 }: SearchResultsSkeletonProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-6 rounded-xl border border-border bg-card/50 animate-pulse"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-lg bg-muted" />
            <div className="h-4 w-32 rounded bg-muted" />
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-2/3 rounded bg-muted" />
          </div>
          <div className="flex gap-2 mb-4">
            <div className="h-5 w-16 rounded bg-muted" />
            <div className="h-5 w-14 rounded bg-muted" />
          </div>
          <div className="flex gap-4">
            <div className="h-3 w-16 rounded bg-muted" />
            <div className="h-3 w-12 rounded bg-muted" />
            <div className="h-3 w-12 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SearchLoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
    </div>
  );
}
