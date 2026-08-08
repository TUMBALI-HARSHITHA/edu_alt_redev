-- Add sender_name to course_chat_messages
ALTER TABLE course_chat_messages ADD COLUMN IF NOT EXISTS sender_name TEXT;

-- Direct messages table for mentor-student DMs
CREATE TABLE IF NOT EXISTS direct_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT,
  sender_id TEXT,
  receiver_id TEXT,
  content TEXT,
  sender_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read direct_messages"
  ON direct_messages FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert direct_messages"
  ON direct_messages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Enable realtime (required for onSnapshot to work)
ALTER PUBLICATION supabase_realtime ADD TABLE direct_messages;
