import { POPULAR_LANGUAGES } from "@/lib/github";
import { X } from "lucide-react";

interface FilterBarProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  goodFirstIssue: boolean;
  onGoodFirstIssueChange: (val: boolean) => void;
  activeTab: "repos" | "issues";
  onTabChange: (tab: "repos" | "issues") => void;
}

export function FilterBar({
  selectedLanguage,
  onLanguageChange,
  sortBy,
  onSortChange,
  goodFirstIssue,
  onGoodFirstIssueChange,
  activeTab,
  onTabChange,
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Tab Toggle */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted w-fit">
        <button
          onClick={() => onTabChange("repos")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "repos"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Repositories
        </button>
        <button
          onClick={() => onTabChange("issues")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "issues"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Good First Issues
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Language Filter */}
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Languages</option>
          {POPULAR_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        {/* Sort Filter - only for repos */}
        {activeTab === "repos" && (
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="best-match">Best Match</option>
            <option value="stars">Most Stars</option>
            <option value="forks">Most Forks</option>
            <option value="updated">Recently Updated</option>
          </select>
        )}

        {/* Good First Issue Toggle - only for repos */}
        {activeTab === "repos" && (
          <button
            onClick={() => onGoodFirstIssueChange(!goodFirstIssue)}
            className={`h-9 px-4 rounded-lg border text-sm font-medium transition-all ${
              goodFirstIssue
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50"
            }`}
          >
            🏷️ Good First Issues
          </button>
        )}

        {/* Active Filter Tags */}
        {selectedLanguage && (
          <span className="inline-flex items-center gap-1 h-9 px-3 rounded-lg bg-primary/10 text-primary text-sm">
            {selectedLanguage}
            <button onClick={() => onLanguageChange("")} className="ml-1 hover:text-primary/70">
              <X className="h-3 w-3" />
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
