-- Migration script to add class_level column to courses and resources tables

-- Add class_level to courses table if it doesn't exist
ALTER TABLE courses ADD COLUMN IF NOT EXISTS class_level TEXT;

-- Add class_level to resources table if it doesn't exist
ALTER TABLE resources ADD COLUMN IF NOT EXISTS class_level TEXT;
