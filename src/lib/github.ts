const GITHUB_API = "https://api.github.com";

export interface GitHubRepo {
  id: number;
  full_name: string;
  name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: string;
  created_at: string;
  updated_at: string;
  comments: number;
  labels: {
    id: number;
    name: string;
    color: string;
  }[];
  repository_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
}

export interface SearchReposResponse {
  total_count: number;
  items: GitHubRepo[];
}

export interface SearchIssuesResponse {
  total_count: number;
  items: GitHubIssue[];
}

export interface SearchFilters {
  query: string;
  language?: string;
  sort?: "stars" | "forks" | "updated" | "best-match";
  goodFirstIssue?: boolean;
  page?: number;
  perPage?: number;
}

export async function searchRepos(filters: SearchFilters): Promise<SearchReposResponse> {
  const { query, language, sort = "best-match", page = 1, perPage = 12 } = filters;

  let q = query || "stars:>100";
  if (language) q += ` language:${language}`;
  if (filters.goodFirstIssue) q += ` good-first-issues:>0`;

  const params = new URLSearchParams({
    q,
    sort: sort === "best-match" ? "" : sort,
    order: "desc",
    page: String(page),
    per_page: String(perPage),
  });

  const res = await fetch(`${GITHUB_API}/search/repositories?${params}`, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `GitHub API error: ${res.status}`);
  }

  return res.json();
}

export async function searchIssues(filters: SearchFilters): Promise<SearchIssuesResponse> {
  const { query, language, page = 1, perPage = 12 } = filters;

  let q = query ? `${query} ` : "";
  q += 'label:"good first issue" state:open';
  if (language) q += ` language:${language}`;

  const params = new URLSearchParams({
    q,
    sort: "created",
    order: "desc",
    page: String(page),
    per_page: String(perPage),
  });

  const res = await fetch(`${GITHUB_API}/search/issues?${params}`, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `GitHub API error: ${res.status}`);
  }

  return res.json();
}

export function extractRepoFromUrl(repositoryUrl: string): string {
  return repositoryUrl.replace("https://api.github.com/repos/", "");
}

export const POPULAR_LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "Go",
  "Rust",
  "C++",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
  "C#",
];
