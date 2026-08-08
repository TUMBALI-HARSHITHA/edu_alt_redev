-- Add DELETE policy for teacher_applications table
-- Previously only SELECT, INSERT, UPDATE policies existed, making deleteDoc fail silently (0 rows affected, no error)

CREATE POLICY "Authenticated users can delete teacher_applications"
  ON teacher_applications FOR DELETE
  USING (auth.role() = 'authenticated');
