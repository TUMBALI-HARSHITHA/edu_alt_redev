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
