-- Supabase initialization script for Edu-Alt-Tech

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  folder TEXT,
  price NUMERIC DEFAULT 0,
  category TEXT,
  duration TEXT,
  level TEXT,
  class_level TEXT,
  instructor TEXT,
  syllabus JSONB,
  prerequisites TEXT[] DEFAULT '{}',
  learning_outcomes TEXT[] DEFAULT '{}',
  rating NUMERIC DEFAULT 0,
  students_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for courses"
  ON courses FOR SELECT
  USING (true);

CREATE POLICY "Admin write access for courses"
  ON courses FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update access for courses"
  ON courses FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete access for courses"
  ON courses FOR DELETE
  USING (auth.role() = 'authenticated');

-- Course Folders
CREATE TABLE IF NOT EXISTS course_folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE course_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for course_folders"
  ON course_folders FOR SELECT
  USING (true);

CREATE POLICY "Admin write access for course_folders"
  ON course_folders FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin delete access for course_folders"
  ON course_folders FOR DELETE
  USING (auth.role() = 'authenticated');

-- Practice Problems
CREATE TABLE IF NOT EXISTS practice_problems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  difficulty TEXT,
  link TEXT,
  topics TEXT[] DEFAULT '{}',
  category TEXT,
  platform TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE practice_problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for practice_problems"
  ON practice_problems FOR SELECT
  USING (true);

CREATE POLICY "Admin write access for practice_problems"
  ON practice_problems FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin delete access for practice_problems"
  ON practice_problems FOR DELETE
  USING (auth.role() = 'authenticated');

-- Resources
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT,
  description TEXT,
  type TEXT,
  class_level TEXT,
  topics TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for resources"
  ON resources FOR SELECT
  USING (true);

CREATE POLICY "Admin write access for resources"
  ON resources FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin delete access for resources"
  ON resources FOR DELETE
  USING (auth.role() = 'authenticated');

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE,
  display_name TEXT,
  photo_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text OR auth.role() = 'authenticated');

CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Teacher Applications
CREATE TABLE IF NOT EXISTS teacher_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  name TEXT,
  email TEXT,
  qualification TEXT,
  experience TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  meeting_link TEXT,
  meeting_date TIMESTAMPTZ,
  applied_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE teacher_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read teacher_applications"
  ON teacher_applications FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert teacher_applications"
  ON teacher_applications FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update teacher_applications"
  ON teacher_applications FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Patch Notes
CREATE TABLE IF NOT EXISTS patch_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE patch_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for patch_notes"
  ON patch_notes FOR SELECT
  USING (true);

CREATE POLICY "Admin write access for patch_notes"
  ON patch_notes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin delete access for patch_notes"
  ON patch_notes FOR DELETE
  USING (auth.role() = 'authenticated');

-- Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  content TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read chat_messages"
  ON chat_messages FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert chat_messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Course Chat Messages
CREATE TABLE IF NOT EXISTS course_chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT,
  user_id TEXT,
  content TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE course_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read course_chat_messages"
  ON course_chat_messages FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert course_chat_messages"
  ON course_chat_messages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- User Progress
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  course_id TEXT,
  module_id TEXT,
  status TEXT DEFAULT 'not_started',
  progress NUMERIC DEFAULT 0,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON user_progress FOR SELECT
  USING (auth.uid()::text = user_id OR auth.role() = 'authenticated');

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Learning Paths
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  path_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own learning_paths"
  ON learning_paths FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own learning_paths"
  ON learning_paths FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own learning_paths"
  ON learning_paths FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Analytics / User Activities
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  event_type TEXT,
  page TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read analytics"
  ON analytics FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert analytics"
  ON analytics FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Enrollments (for CourseDetails.tsx)
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  course_id TEXT,
  role TEXT DEFAULT 'student',
  student_status TEXT DEFAULT 'active',
  status TEXT DEFAULT 'active',
  amount NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own enrollments"
  ON enrollments FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Anyone authenticated can insert enrollments"
  ON enrollments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Anyone authenticated can update enrollments"
  ON enrollments FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- User Downloads tracking
CREATE TABLE IF NOT EXISTS user_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  resource_title TEXT NOT NULL,
  resource_url TEXT NOT NULL,
  resource_type TEXT DEFAULT 'pdf',
  course_id TEXT,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own downloads"
  ON user_downloads FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own downloads"
  ON user_downloads FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Scheduled Classes (teacher schedules live classes with meeting links)
CREATE TABLE IF NOT EXISTS scheduled_classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT NOT NULL,
  teacher_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  meeting_link TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE scheduled_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read scheduled_classes"
  ON scheduled_classes FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert scheduled_classes"
  ON scheduled_classes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update scheduled_classes"
  ON scheduled_classes FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Notifications table (for admin notifications about teacher-scheduled classes)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (auth.uid()::text = user_id OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid()::text = user_id OR auth.role() = 'authenticated');

-- Safe migration statements to ensure existing DB tables get the new columns
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS meeting_link TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS meeting_date TIMESTAMPTZ;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS languages TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS languages_count INTEGER;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS highest_qualification TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS subjects TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS teaching_mode TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS agree_terms BOOLEAN DEFAULT false;
