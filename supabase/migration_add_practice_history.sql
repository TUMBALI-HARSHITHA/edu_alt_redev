CREATE TABLE IF NOT EXISTS public.practice_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_type TEXT NOT NULL CHECK (practice_type IN ('leetcode', 'english')),
  item_id INTEGER NOT NULL,
  item_title TEXT NOT NULL,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_practice_history_user_id ON public.practice_history(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_history_opened_at ON public.practice_history(opened_at DESC);

ALTER TABLE public.practice_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own practice history"
  ON public.practice_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own practice history"
  ON public.practice_history FOR SELECT
  USING (auth.uid() = user_id);
