-- Table for admin platform course overrides (syncs across devices)
CREATE TABLE IF NOT EXISTS platform_overrides (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE platform_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for platform_overrides"
  ON platform_overrides FOR SELECT
  USING (true);

CREATE POLICY "Admin write access for platform_overrides"
  ON platform_overrides FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update access for platform_overrides"
  ON platform_overrides FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete access for platform_overrides"
  ON platform_overrides FOR DELETE
  USING (auth.role() = 'authenticated');
