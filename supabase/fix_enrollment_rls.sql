-- SECURITY DEFINER RPC to bypass RLS for enrollment creation
-- This is needed because upsert in PostgREST can conflict with INSERT policies
-- when the row doesn't match the policy's USING/WITH CHECK conditions.

CREATE OR REPLACE FUNCTION create_enrollment(
  p_id UUID,
  p_user_id TEXT,
  p_course_id TEXT,
  p_role TEXT DEFAULT 'student',
  p_student_status TEXT DEFAULT 'active'
) RETURNS void
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO enrollments (id, user_id, course_id, role, student_status, created_at)
  VALUES (p_id, p_user_id, p_course_id, p_role, p_student_status, now());
END;
$$ LANGUAGE plpgsql;

-- Also create a function to check the current auth role for debugging
CREATE OR REPLACE FUNCTION auth_role_check()
RETURNS TEXT
SECURITY DEFINER
AS $$
BEGIN
  RETURN COALESCE(auth.role()::text, 'null');
END;
$$ LANGUAGE plpgsql;
