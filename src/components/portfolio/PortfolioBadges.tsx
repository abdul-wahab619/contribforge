import { type Contribution } from "@/hooks/useContributions";
import { Trophy, Flame, Star, Zap, GitPullRequest, GitCommit, AlertCircle, Award } from "lucide-react";

interface BadgeDef {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  check: (contributions: Contribution[]) => boolean;
  color: string;
}

const BADGES: BadgeDef[] = [
  {
    id: "first-pr",
    label: "First PR",
    description: "Opened your first pull request",
    icon: GitPullRequest,
    check: (c) => c.some((x) => x.type === "pr"),
    color: "text-primary",
  },
  {
    id: "pr-champion",
    label: "PR Champion",
    description: "Opened 10+ pull requests",
    icon: Trophy,
    check: (c) => c.filter((x) => x.type === "pr").length >= 10,
    color: "text-yellow-500",
  },
  {
    id: "merger",
    label: "Merger",
    description: "Had 5+ PRs merged",
    icon: Zap,
    check: (c) => c.filter((x) => x.type === "pr" && x.merged_at_gh).length >= 5,
    color: "text-purple-400",
  },
  {
    id: "committer",
    label: "Committer",
    description: "Made 50+ commits",
    icon: GitCommit,
    check: (c) => c.filter((x) => x.type === "commit").length >= 50,
    color: "text-blue-400",
  },
  {
    id: "issue-hunter",
    label: "Issue Hunter",
    description: "Opened 10+ issues",
    icon: AlertCircle,
    check: (c) => c.filter((x) => x.type === "issue").length >= 10,
    color: "text-orange-400",
  },
  {
    id: "multi-repo",
    label: "Explorer",
    description: "Contributed to 5+ repos",
    icon: Star,
    check: (c) => new Set(c.map((x) => x.repo_full_name)).size >= 5,
    color: "text-emerald-400",
  },
  {
    id: "on-fire",
    label: "On Fire",
    description: "100+ total contributions",
    icon: Flame,
    check: (c) => c.length >= 100,
    color: "text-red-400",
  },
  {
    id: "prolific",
    label: "Prolific",
    description: "250+ total contributions",
    icon: Award,
    check: (c) => c.length >= 250,
    color: "text-amber-400",
  },
];

export function PortfolioBadges({ contributions }: { contributions: Contribution[] }) {
  const earned = BADGES.filter((b) => b.check(contributions));
  const locked = BADGES.filter((b) => !b.check(contributions));

  if (earned.length === 0 && contributions.length === 0) return null;

  return (
    <div className="space-y-4">
      {earned.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {earned.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card/50 text-center"
            >
              <div className={`p-2.5 rounded-full bg-muted ${badge.color}`}>
                <badge.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-foreground">{badge.label}</span>
              <span className="text-[10px] text-muted-foreground leading-tight">{badge.description}</span>
            </div>
          ))}
        </div>
      )}

      {locked.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {locked.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card/30 text-center opacity-40"
            >
              <div className="p-2.5 rounded-full bg-muted text-muted-foreground">
                <badge.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{badge.label}</span>
              <span className="text-[10px] text-muted-foreground leading-tight">{badge.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
