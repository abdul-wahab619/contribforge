import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Contribution, ActivityDay } from "./useContributions";

export interface PublicProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  github_username: string | null;
  created_at: string;
}

export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: ["public-profile", username],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("github_username", username)
        .maybeSingle();
      if (error) throw error;
      return data as PublicProfile | null;
    },
    enabled: !!username,
  });
}

export function usePublicContributions(userId: string | undefined) {
  return useQuery({
    queryKey: ["public-contributions", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contributions")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at_gh", { ascending: false });
      if (error) throw error;
      return (data as unknown) as Contribution[];
    },
    enabled: !!userId,
  });
}

export function usePublicActivity(userId: string | undefined) {
  return useQuery({
    queryKey: ["public-activity", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contribution_activity")
        .select("*")
        .eq("user_id", userId!)
        .order("activity_date", { ascending: true });
      if (error) throw error;
      return (data as unknown) as ActivityDay[];
    },
    enabled: !!userId,
  });
}
