
-- Table for storing GitHub contributions (PRs, commits, issues)
CREATE TABLE public.contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pr', 'commit', 'issue')),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  repo_full_name TEXT NOT NULL,
  state TEXT, -- open, closed, merged
  created_at_gh TIMESTAMP WITH TIME ZONE, -- GitHub timestamp
  closed_at_gh TIMESTAMP WITH TIME ZONE,
  merged_at_gh TIMESTAMP WITH TIME ZONE,
  additions INTEGER DEFAULT 0,
  deletions INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  labels JSONB DEFAULT '[]'::jsonb,
  gh_id TEXT NOT NULL, -- GitHub unique ID to prevent duplicates
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, gh_id)
);

-- Table for daily activity summary (for heatmap)
CREATE TABLE public.contribution_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_date DATE NOT NULL,
  pr_count INTEGER DEFAULT 0,
  commit_count INTEGER DEFAULT 0,
  issue_count INTEGER DEFAULT 0,
  total_count INTEGER GENERATED ALWAYS AS (pr_count + commit_count + issue_count) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, activity_date)
);

-- Sync status tracking
CREATE TABLE public.contribution_sync (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT DEFAULT 'idle' CHECK (sync_status IN ('idle', 'syncing', 'error')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_sync ENABLE ROW LEVEL SECURITY;

-- RLS policies for contributions
CREATE POLICY "Users can view their own contributions" ON public.contributions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own contributions" ON public.contributions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own contributions" ON public.contributions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own contributions" ON public.contributions FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for contribution_activity
CREATE POLICY "Users can view their own activity" ON public.contribution_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own activity" ON public.contribution_activity FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own activity" ON public.contribution_activity FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own activity" ON public.contribution_activity FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for contribution_sync
CREATE POLICY "Users can view their own sync status" ON public.contribution_sync FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sync status" ON public.contribution_sync FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sync status" ON public.contribution_sync FOR UPDATE USING (auth.uid() = user_id);

-- Trigger for updated_at on contributions
CREATE TRIGGER update_contributions_updated_at
  BEFORE UPDATE ON public.contributions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_contributions_user_type ON public.contributions(user_id, type);
CREATE INDEX idx_contributions_user_date ON public.contributions(user_id, created_at_gh DESC);
CREATE INDEX idx_activity_user_date ON public.contribution_activity(user_id, activity_date DESC);
