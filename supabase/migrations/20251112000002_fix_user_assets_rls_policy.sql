-- Migration: Fix RLS policy for user-owned assets in storage.
-- This migration drops the faulty policy and creates a corrected one.

-- 1. Drop the old, incorrect policy.
DROP POLICY IF EXISTS "Users can manage their own assets" ON storage.objects;

-- 2. Create the new, corrected policy.
-- This policy ensures that users can only upload/manage files within their own folder,
-- identified by their UID in the path (e.g., 'users/USER_ID/...').
CREATE POLICY "Users can manage their own assets"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id = 'assets' AND
    (storage.foldername(name))[1] = 'users' AND
    auth.uid()::text = (storage.foldername(name))[2]
  )
  WITH CHECK (
    bucket_id = 'assets' AND
    (storage.foldername(name))[1] = 'users' AND
    auth.uid()::text = (storage.foldername(name))[2]
  );
