
-- Allow public read access to profiles by username (for portfolio pages)
CREATE POLICY "Public can view profiles by username"
ON public.profiles
FOR SELECT
USING (github_username IS NOT NULL);

-- Allow public read access to contributions for users with public profiles
CREATE POLICY "Public can view contributions"
ON public.contributions
FOR SELECT
USING (
  user_id IN (SELECT id FROM public.profiles WHERE github_username IS NOT NULL)
);

-- Allow public read access to contribution_activity for users with public profiles
CREATE POLICY "Public can view contribution activity"
ON public.contribution_activity
FOR SELECT
USING (
  user_id IN (SELECT id FROM public.profiles WHERE github_username IS NOT NULL)
);
