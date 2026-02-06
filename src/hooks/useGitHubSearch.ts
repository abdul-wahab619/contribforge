import { useQuery } from "@tanstack/react-query";
import { searchRepos, searchIssues, type SearchFilters } from "@/lib/github";

export function useSearchRepos(filters: SearchFilters, enabled = true) {
  return useQuery({
    queryKey: ["github-repos", filters],
    queryFn: () => searchRepos(filters),
    enabled: enabled && !!filters.query,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useSearchIssues(filters: SearchFilters, enabled = true) {
  return useQuery({
    queryKey: ["github-issues", filters],
    queryFn: () => searchIssues(filters),
    enabled: enabled && !!filters.query,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
