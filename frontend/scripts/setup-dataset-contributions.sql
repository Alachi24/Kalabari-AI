-- Create dataset_contributions table
CREATE TABLE IF NOT EXISTS public.dataset_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  data_type TEXT NOT NULL CHECK (data_type IN ('general', 'technical', 'domain', 'cultural')),
  language_pairs TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
  lines_count INTEGER DEFAULT 0,
  quality_score INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_dataset_contributions_user_id ON public.dataset_contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_dataset_contributions_status ON public.dataset_contributions(status);
CREATE INDEX IF NOT EXISTS idx_dataset_contributions_created_at ON public.dataset_contributions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.dataset_contributions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow users to see their own contributions
CREATE POLICY "Users can view their own contributions"
  ON public.dataset_contributions
  FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'authenticated');

-- Allow users to create contributions
CREATE POLICY "Users can create contributions"
  ON public.dataset_contributions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to view approved contributions (for leaderboard)
CREATE POLICY "Users can view approved contributions"
  ON public.dataset_contributions
  FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id);

-- Create contributions_stats view
CREATE OR REPLACE VIEW public.contributions_stats AS
SELECT
  u.id as user_id,
  u.email,
  COUNT(dc.id) as total_contributions,
  COUNT(CASE WHEN dc.status = 'approved' THEN 1 END) as approved_contributions,
  SUM(CASE WHEN dc.status = 'approved' THEN dc.lines_count ELSE 0 END) as total_lines_contributed,
  AVG(CASE WHEN dc.status = 'approved' THEN dc.quality_score ELSE NULL END) as avg_quality_score,
  MAX(dc.created_at) as last_contribution_date
FROM auth.users u
LEFT JOIN public.dataset_contributions dc ON u.id = dc.user_id
GROUP BY u.id, u.email
HAVING COUNT(dc.id) > 0
ORDER BY approved_contributions DESC;

-- Grant permissions
GRANT SELECT ON public.dataset_contributions TO authenticated;
GRANT INSERT ON public.dataset_contributions TO authenticated;
GRANT SELECT ON public.contributions_stats TO authenticated;
