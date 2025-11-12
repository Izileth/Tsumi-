-- Migration: Allow any clan member to manage clan assets.
-- This migration replaces the owner-only policy with a more permissive one.

-- 1. Drop the old, owner-only policy for clan assets.
DROP POLICY IF EXISTS "Clan owners can manage their clan's assets" ON storage.objects;

-- 2. Create a new policy to allow any member of a clan to manage its assets.
-- This policy checks if the user's 'clan_id' in their profile matches the clan ID in the file path.
CREATE POLICY "Clan members can manage their clan's assets"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id = 'assets' AND
    (storage.foldername(name))[1] = 'clans' AND
    (SELECT clan_id FROM public.profiles WHERE id = auth.uid()) = ((storage.foldername(name))[2])::uuid
  )
  WITH CHECK (
    bucket_id = 'assets' AND
    (storage.foldername(name))[1] = 'clans' AND
    (SELECT clan_id FROM public.profiles WHERE id = auth.uid()) = ((storage.foldername(name))[2])::uuid
  );
