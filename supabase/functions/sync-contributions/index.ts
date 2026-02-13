import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GITHUB_API = "https://api.github.com";

async function ghFetch(url: string) {
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github.v3+json", "User-Agent": "ContribForge" },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text()}`);
  return res.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing auth");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get user from token
    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await anonClient.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    // Get GitHub username from profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("github_username")
      .eq("id", user.id)
      .single();

    if (!profile?.github_username) {
      return new Response(
        JSON.stringify({ error: "No GitHub username linked. Please set it in Profile Settings." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const username = profile.github_username;

    // Update sync status
    await supabase.from("contribution_sync").upsert(
      { user_id: user.id, sync_status: "syncing", error_message: null },
      { onConflict: "user_id" }
    );

    // Fetch PRs (authored by user)
    const prs = await ghFetch(
      `${GITHUB_API}/search/issues?q=author:${username}+type:pr&sort=created&order=desc&per_page=100`
    );

    // Fetch issues (authored by user, not PRs)
    const issues = await ghFetch(
      `${GITHUB_API}/search/issues?q=author:${username}+type:issue&sort=created&order=desc&per_page=100`
    );

    // Fetch recent events for commits
    const events = await ghFetch(`${GITHUB_API}/users/${username}/events?per_page=100`);
    const pushEvents = events.filter((e: any) => e.type === "PushEvent");

    // Build contributions array
    const contributions: any[] = [];

    for (const pr of prs.items || []) {
      const repoName = pr.repository_url?.replace("https://api.github.com/repos/", "") || "";
      contributions.push({
        user_id: user.id,
        type: "pr",
        title: pr.title,
        url: pr.html_url,
        repo_full_name: repoName,
        state: pr.pull_request?.merged_at ? "merged" : pr.state,
        created_at_gh: pr.created_at,
        closed_at_gh: pr.closed_at,
        merged_at_gh: pr.pull_request?.merged_at || null,
        comments: pr.comments || 0,
        labels: (pr.labels || []).map((l: any) => ({ name: l.name, color: l.color })),
        gh_id: `pr_${pr.id}`,
      });
    }

    for (const issue of issues.items || []) {
      const repoName = issue.repository_url?.replace("https://api.github.com/repos/", "") || "";
      contributions.push({
        user_id: user.id,
        type: "issue",
        title: issue.title,
        url: issue.html_url,
        repo_full_name: repoName,
        state: issue.state,
        created_at_gh: issue.created_at,
        closed_at_gh: issue.closed_at,
        comments: issue.comments || 0,
        labels: (issue.labels || []).map((l: any) => ({ name: l.name, color: l.color })),
        gh_id: `issue_${issue.id}`,
      });
    }

    for (const event of pushEvents) {
      const commits = event.payload?.commits || [];
      for (const commit of commits) {
        if (commit.author?.email && commit.distinct) {
          contributions.push({
            user_id: user.id,
            type: "commit",
            title: commit.message?.split("\n")[0] || "Commit",
            url: `https://github.com/${event.repo?.name}/commit/${commit.sha}`,
            repo_full_name: event.repo?.name || "",
            state: null,
            created_at_gh: event.created_at,
            gh_id: `commit_${commit.sha}`,
          });
        }
      }
    }

    // Upsert contributions
    if (contributions.length > 0) {
      const { error: upsertErr } = await supabase
        .from("contributions")
        .upsert(contributions, { onConflict: "user_id,gh_id", ignoreDuplicates: false });
      if (upsertErr) console.error("Upsert error:", upsertErr);
    }

    // Build activity data from contributions
    const activityMap = new Map<string, { pr: number; commit: number; issue: number }>();
    for (const c of contributions) {
      const date = c.created_at_gh ? new Date(c.created_at_gh).toISOString().split("T")[0] : null;
      if (!date) continue;
      const existing = activityMap.get(date) || { pr: 0, commit: 0, issue: 0 };
      if (c.type === "pr") existing.pr++;
      else if (c.type === "commit") existing.commit++;
      else if (c.type === "issue") existing.issue++;
      activityMap.set(date, existing);
    }

    const activityRows = Array.from(activityMap.entries()).map(([date, counts]) => ({
      user_id: user.id,
      activity_date: date,
      pr_count: counts.pr,
      commit_count: counts.commit,
      issue_count: counts.issue,
    }));

    if (activityRows.length > 0) {
      await supabase
        .from("contribution_activity")
        .upsert(activityRows, { onConflict: "user_id,activity_date" });
    }

    // Update sync status
    await supabase.from("contribution_sync").upsert(
      { user_id: user.id, sync_status: "idle", last_synced_at: new Date().toISOString(), error_message: null },
      { onConflict: "user_id" }
    );

    return new Response(
      JSON.stringify({
        success: true,
        synced: { prs: prs.items?.length || 0, issues: issues.items?.length || 0, commits: pushEvents.reduce((a: number, e: any) => a + (e.payload?.commits?.length || 0), 0) },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Sync error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
