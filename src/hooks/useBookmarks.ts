import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Bookmark {
  id: string;
  user_id: string;
  title: string;
  url: string;
  type: "repo" | "issue";
  description: string | null;
  labels: unknown;
  language: string | null;
  stars: number | null;
  owner: string | null;
  repo_name: string | null;
  issue_number: number | null;
  created_at: string;
}

export function useBookmarks(type?: "repo" | "issue") {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["bookmarks", user?.id, type],
    queryFn: async () => {
      let query = supabase
        .from("bookmarks" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (type) {
        query = query.eq("type", type);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as unknown) as Bookmark[];
    },
    enabled: !!user,
  });
}

export function useIsBookmarked(url: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["bookmark-check", user?.id, url],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookmarks" as any)
        .select("id")
        .eq("url", url)
        .maybeSingle();

      if (error) throw error;
      return (data as unknown) as { id: string } | null;
    },
    enabled: !!user,
  });
}

export function useAddBookmark() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (bookmark: Omit<Bookmark, "id" | "user_id" | "created_at">) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("bookmarks" as any)
        .insert({ ...bookmark, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["bookmark-check"] });
      toast.success("Bookmarked!");
    },
    onError: (error) => {
      toast.error("Failed to bookmark: " + error.message);
    },
  });
}

export function useRemoveBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookmarkId: string) => {
      const { error } = await supabase
        .from("bookmarks" as any)
        .delete()
        .eq("id", bookmarkId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["bookmark-check"] });
      toast.success("Bookmark removed");
    },
    onError: (error) => {
      toast.error("Failed to remove bookmark: " + error.message);
    },
  });
}
