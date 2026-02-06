import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";
import { FilterBar } from "@/components/search/FilterBar";
import { RepoCard } from "@/components/search/RepoCard";
import { IssueCard } from "@/components/search/IssueCard";
import { SearchResultsSkeleton } from "@/components/search/SearchSkeleton";
import { useSearchRepos, useSearchIssues } from "@/hooks/useGitHubSearch";
import { Button } from "@/components/ui/button";
import type { SearchFilters } from "@/lib/github";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [language, setLanguage] = useState("");
  const [sortBy, setSortBy] = useState("best-match");
  const [goodFirstIssue, setGoodFirstIssue] = useState(false);
  const [activeTab, setActiveTab] = useState<"repos" | "issues">("repos");
  const [page, setPage] = useState(1);

  const filters: SearchFilters = {
    query,
    language: language || undefined,
    sort: sortBy as SearchFilters["sort"],
    goodFirstIssue,
    page,
    perPage: 12,
  };

  const { data: repoData, isLoading: reposLoading, error: reposError } = useSearchRepos(filters, activeTab === "repos");
  const { data: issueData, isLoading: issuesLoading, error: issuesError } = useSearchIssues(filters, activeTab === "issues");

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
    setSearchParams({ q: newQuery });
  };

  const isLoading = activeTab === "repos" ? reposLoading : issuesLoading;
  const error = activeTab === "repos" ? reposError : issuesError;
  const totalCount = activeTab === "repos" ? repoData?.total_count : issueData?.total_count;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">C</span>
              </div>
              <span className="text-lg font-semibold text-foreground">ContribForge</span>
            </div>
          </div>
          <SearchBar onSearch={handleSearch} initialQuery={query} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6">
          <FilterBar
            selectedLanguage={language}
            onLanguageChange={(l) => { setLanguage(l); setPage(1); }}
            sortBy={sortBy}
            onSortChange={(s) => { setSortBy(s); setPage(1); }}
            goodFirstIssue={goodFirstIssue}
            onGoodFirstIssueChange={(v) => { setGoodFirstIssue(v); setPage(1); }}
            activeTab={activeTab}
            onTabChange={(t) => { setActiveTab(t); setPage(1); }}
          />
        </div>

        {/* Result Count */}
        {query && totalCount !== undefined && (
          <p className="text-sm text-muted-foreground mb-6">
            {totalCount.toLocaleString()} {activeTab === "repos" ? "repositories" : "issues"} found
          </p>
        )}

        {/* Empty State */}
        {!query && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Search open source projects</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Discover repositories and beginner-friendly issues to start contributing today.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {["react", "machine-learning", "web-dev", "cli-tools", "api"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleSearch(tag)}
                  className="px-4 py-2 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-destructive/50 bg-destructive/10 text-destructive mb-6">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">API rate limit or error</p>
              <p className="text-xs mt-1 opacity-80">{(error as Error).message}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <SearchResultsSkeleton />}

        {/* Repo Results */}
        {!isLoading && activeTab === "repos" && repoData && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repoData.items.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}

        {/* Issue Results */}
        {!isLoading && activeTab === "issues" && issueData && (
          <div className="grid md:grid-cols-2 gap-4">
            {issueData.items.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {query && totalCount !== undefined && totalCount > 12 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {Math.ceil(Math.min(totalCount, 1000) / 12)}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page * 12 >= Math.min(totalCount, 1000)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
