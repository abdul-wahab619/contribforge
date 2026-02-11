import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Contribution {
  id: string;
  user_id: string;
  type: "pr" | "commit" | "issue";
  title: string;
  url: string;
  repo_full_name: string;
  state: string | null;
  created_at_gh: string | null;
  closed_at_gh: string | null;
  merged_at_gh: string | null;
  additions: number;
  deletions: number;
  comments: number;
  labels: any;
  gh_id: string;
  created_at: string;
}

export interface ActivityDay {
  id: string;
  user_id: string;
  activity_date: string;
  pr_count: number;
  commit_count: number;
  issue_count: number;
  total_count: number;
}

export interface SyncStatus {
  id: string;
  user_id: string;
  last_synced_at: string | null;
  sync_status: string;
  error_message: string | null;
}

export function useContributions(type?: "pr" | "commit" | "issue") {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["contributions", user?.id, type],
    queryFn: async () => {
      let query = supabase
        .from("contributions" as any)
        .select("*")
        .order("created_at_gh", { ascending: false });
      if (type) query = query.eq("type", type);
      const { data, error } = await query;
      if (error) throw error;
      return (data as unknown) as Contribution[];
    },
    enabled: !!user,
  });
}

export function useContributionActivity() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["contribution-activity", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contribution_activity" as any)
        .select("*")
        .order("activity_date", { ascending: true });
      if (error) throw error;
      return (data as unknown) as ActivityDay[];
    },
    enabled: !!user,
  });
}

export function useSyncStatus() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["sync-status", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contribution_sync" as any)
        .select("*")
        .maybeSingle();
      if (error) throw error;
      return (data as unknown) as SyncStatus | null;
    },
    enabled: !!user,
  });
}

export function useSyncContributions() {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const res = await supabase.functions.invoke("sync-contributions", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.error) throw res.error;
      if (res.data?.error) throw new Error(res.data.error);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["contributions"] });
      queryClient.invalidateQueries({ queryKey: ["contribution-activity"] });
      queryClient.invalidateQueries({ queryKey: ["sync-status"] });
      toast.success(
        `Synced ${data.synced.prs} PRs, ${data.synced.issues} issues, ${data.synced.commits} commits`
      );
    },
    onError: (err) => {
      toast.error("Sync failed: " + err.message);
    },
  });
}
