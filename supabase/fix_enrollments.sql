-- 1. Add missing columns to enrollments
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS student_status TEXT DEFAULT 'active';
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'not-required';
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS mentor_id TEXT;

-- 2. Drop the old restrictive INSERT policy (requires exact user_id match)
DROP POLICY IF EXISTS "Users can insert own enrollments" ON enrollments;

-- 3. Create broader INSERT policy so admin can create teacher enrollments
CREATE POLICY "Anyone authenticated can insert enrollments"
  ON enrollments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 4. Add UPDATE policy for admin use
CREATE POLICY "Anyone authenticated can update enrollments"
  ON enrollments FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
