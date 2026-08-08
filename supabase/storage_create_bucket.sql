-- Create the 'public' storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('public', 'public', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public');

-- Allow authenticated users to read any file
CREATE POLICY "Authenticated read"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'public');

-- Allow authenticated users to update own files
CREATE POLICY "Authenticated update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'public');

-- Allow authenticated users to delete own files
CREATE POLICY "Authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'public');
