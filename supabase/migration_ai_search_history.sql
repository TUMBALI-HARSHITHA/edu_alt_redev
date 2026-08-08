CREATE TABLE IF NOT EXISTS ai_search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  mode TEXT DEFAULT 'chat',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ai_search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own search history"
  ON ai_search_history FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own search history"
  ON ai_search_history FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own search history"
  ON ai_search_history FOR DELETE
  USING (auth.uid()::text = user_id);
