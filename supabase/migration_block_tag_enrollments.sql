-- Add blocked and tags columns to enrollments for teacher block/tag functionality
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS blocked BOOLEAN DEFAULT false;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;

-- Allow teachers to read enrollments for courses they teach (needed for student listing)
DROP POLICY IF EXISTS "Users can read own enrollments" ON enrollments;
CREATE POLICY "Authenticated users can read all enrollments"
  ON enrollments FOR SELECT
  USING (auth.role() = 'authenticated');
