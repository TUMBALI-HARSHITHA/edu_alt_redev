-- Run this in Supabase SQL editor (Dashboard > SQL Editor)
-- Adds columns for the simplified teacher application form

ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS subjects TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS teaching_mode TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS agree_terms BOOLEAN DEFAULT false;
