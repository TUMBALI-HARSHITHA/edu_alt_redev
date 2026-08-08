-- ═══════════════════════════════════════════════════════════════════
-- Security Migration: Fix RLS Policies for Least-Privilege Access
-- ═══════════════════════════════════════════════════════════════════
-- This migration fixes privilege escalation and data exposure issues:
--   1. users: restrict read to own record only
--   2. enrollments: prevent insertion with arbitrary user_id
--   3. teacher_applications: restrict read to own record or admin
--   4. notifications: restrict read to own user_id only
--   5. courses/patch_notes/resources: restrict write to admins only
-- ═══════════════════════════════════════════════════════════════════

-- ── Helper: check if user has admin role ──────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()::text
      AND role = 'admin'
  );
$$;

-- ── 1. users: restrict SELECT to own row ──────────────────────────
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT
  USING (auth.uid()::text = id::text);

-- Admins can still read all users via a separate policy
CREATE POLICY "Admin can read all users" ON public.users
  FOR SELECT
  USING (public.is_admin());

-- ── 2. enrollments: restrict INSERT to own user_id ────────────────
DROP POLICY IF EXISTS "Users can read own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Anyone authenticated can insert enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Anyone authenticated can update enrollments" ON public.enrollments;

CREATE POLICY "Users can read own enrollments" ON public.enrollments
  FOR SELECT
  USING (auth.uid()::text = user_id OR public.is_admin());

CREATE POLICY "Users can insert own enrollments" ON public.enrollments
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own enrollments" ON public.enrollments
  FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Teachers/admins can read enrollments for their courses
CREATE POLICY "Teachers can read course enrollments" ON public.enrollments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments AS e
      WHERE e.course_id = enrollments.course_id
        AND e.user_id = auth.uid()::text
        AND e.role = 'teacher'
    )
    OR public.is_admin()
  );

-- ── 3. teacher_applications: restrict to own or admin ─────────────
DROP POLICY IF EXISTS "Authenticated users can read teacher_applications" ON public.teacher_applications;
DROP POLICY IF EXISTS "Authenticated users can insert teacher_applications" ON public.teacher_applications;
DROP POLICY IF EXISTS "Admin can update teacher_applications" ON public.teacher_applications;

CREATE POLICY "Users can read own applications" ON public.teacher_applications
  FOR SELECT
  USING (auth.uid()::text = user_id OR public.is_admin());

CREATE POLICY "Users can insert own applications" ON public.teacher_applications
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Admin can manage applications" ON public.teacher_applications
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete applications" ON public.teacher_applications
  FOR DELETE
  USING (public.is_admin());

-- ── 4. notifications: restrict to own user_id only ────────────────
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

CREATE POLICY "Users can read own notifications" ON public.notifications
  FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Admin can send notifications" ON public.notifications
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- ── 5. Admin-gated write access for content tables ────────────────
DROP POLICY IF EXISTS "Admin write access for courses" ON public.courses;
DROP POLICY IF EXISTS "Admin update access for courses" ON public.courses;
DROP POLICY IF EXISTS "Admin delete access for courses" ON public.courses;

CREATE POLICY "Admin write access for courses" ON public.courses
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update access for courses" ON public.courses
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete access for courses" ON public.courses
  FOR DELETE
  USING (public.is_admin());

-- Patch notes
DROP POLICY IF EXISTS "Admin write access for patch_notes" ON public.patch_notes;
DROP POLICY IF EXISTS "Admin delete access for patch_notes" ON public.patch_notes;

CREATE POLICY "Admin write access for patch_notes" ON public.patch_notes
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update access for patch_notes" ON public.patch_notes
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete access for patch_notes" ON public.patch_notes
  FOR DELETE
  USING (public.is_admin());

-- Resources
DROP POLICY IF EXISTS "Admin write access for resources" ON public.resources;
DROP POLICY IF EXISTS "Admin delete access for resources" ON public.resources;

CREATE POLICY "Admin write access for resources" ON public.resources
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update access for resources" ON public.resources
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete access for resources" ON public.resources
  FOR DELETE
  USING (public.is_admin());

-- Course folders
DROP POLICY IF EXISTS "Admin write access for course_folders" ON public.course_folders;
DROP POLICY IF EXISTS "Admin delete access for course_folders" ON public.course_folders;

CREATE POLICY "Admin write access for course_folders" ON public.course_folders
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update access for course_folders" ON public.course_folders
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete access for course_folders" ON public.course_folders
  FOR DELETE
  USING (public.is_admin());

-- Practice problems
DROP POLICY IF EXISTS "Admin write access for practice_problems" ON public.practice_problems;
DROP POLICY IF EXISTS "Admin delete access for practice_problems" ON public.practice_problems;

CREATE POLICY "Admin write access for practice_problems" ON public.practice_problems
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update access for practice_problems" ON public.practice_problems
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete access for practice_problems" ON public.practice_problems
  FOR DELETE
  USING (public.is_admin());
