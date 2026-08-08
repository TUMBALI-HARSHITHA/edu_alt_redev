-- Add extended columns to teacher_applications
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS date_of_birth TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS highest_qualification TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS specialization TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS current_occupation TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS languages TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS languages_count INTEGER;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS subjects TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS course_category TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS teaching_mode TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS preferred_timings TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS class_duration TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS target_audience TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS resume_url TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS certificates_url TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS id_proof_url TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS intro_video_url TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS demo_video_url TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS sample_content TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS bank_account_name TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS bank_account_number TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS bank_ifsc TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS bank_upi TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS bank_pan TEXT;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS agree_terms BOOLEAN DEFAULT false;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS agree_content_ownership BOOLEAN DEFAULT false;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS agree_revenue_sharing BOOLEAN DEFAULT false;
ALTER TABLE teacher_applications ADD COLUMN IF NOT EXISTS profile_photo TEXT;

-- Teacher earnings table
CREATE TABLE IF NOT EXISTS teacher_earnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id TEXT NOT NULL,
  course_id TEXT,
  amount NUMERIC DEFAULT 0,
  type TEXT DEFAULT 'payout',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE teacher_earnings ENABLE ROW LEVEL SECURITY;

-- Teacher recurring classes table
CREATE TABLE IF NOT EXISTS teacher_recurring_classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  meeting_link TEXT NOT NULL,
  repeat_type TEXT DEFAULT 'daily',
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE teacher_recurring_classes ENABLE ROW LEVEL SECURITY;
