-- Migration: Consolidate storage buckets and refine RLS policies

-- 1. Drop existing RLS policies for old buckets to avoid conflicts.
-- Note: Dropping policies might fail if they don't exist, which is okay.
-- We use 'DROP POLICY IF EXISTS' for broader compatibility, but Supabase migrations
-- might require knowing the exact table, so we'll be specific.

-- Policies on storage.objects for 'avatars'
DROP POLICY IF EXISTS "Imagens de avatar são publicamente acessíveis." ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload de seus próprios avatares." ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios avatares." ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios avatares." ON storage.objects;

-- Policies on storage.objects for 'banners'
DROP POLICY IF EXISTS "Imagens de banner são publicamente acessíveis." ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload de seus próprios banners." ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios banners." ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios banners." ON storage.objects;

-- Policies on storage.objects for 'clan-assets'
DROP POLICY IF EXISTS "Authenticated users can view clan assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload clan assets" ON storage.objects;
DROP POLICY IF EXISTS "Clan owners can update their own assets" ON storage.objects;
DROP POLICY IF EXISTS "Clan owners can delete their own assets" ON storage.objects;

-- 2. Drop the old storage buckets.
-- WARNING: This will delete all objects within these buckets.
-- This is intended for a clean, consolidated setup.
DELETE FROM storage.objects WHERE bucket_id = 'avatars';
DELETE FROM storage.buckets WHERE id = 'avatars';

DELETE FROM storage.objects WHERE bucket_id = 'banners';
DELETE FROM storage.buckets WHERE id = 'banners';

DELETE FROM storage.objects WHERE bucket_id = 'clan-assets';
DELETE FROM storage.buckets WHERE id = 'clan-assets';


-- 3. Create a single, consolidated 'assets' bucket.
-- This bucket will store all user and clan images.
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Create new, refined RLS policies for the 'assets' bucket.

-- ASSETS: PUBLIC READ ACCESS
-- All objects in the 'assets' bucket are publicly readable.
CREATE POLICY "Assets are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'assets');

-- ASSETS: USER-OWNED UPLOAD/UPDATE/DELETE
-- Users can manage files in a folder path that matches their UID.
-- e.g., 'users/123e4567-e89b-12d3-a456-426614174000/avatar.png'

CREATE POLICY "Users can manage their own assets"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id = 'assets' AND
    auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'assets' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );


-- ASSETS: CLAN-OWNED UPLOAD/UPDATE/DELETE
-- Users who own a clan can manage files in a folder path for that clan.
-- e.g., 'clans/a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6/banner.png'

CREATE POLICY "Clan owners can manage their clan's assets"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id = 'assets' AND
    (storage.foldername(name))[1] = 'clans' AND
    auth.uid() = (
      SELECT owner_id FROM public.clans WHERE id = ((storage.foldername(name))[2])::uuid
    )
  )
  WITH CHECK (
    bucket_id = 'assets' AND
    (storage.foldername(name))[1] = 'clans' AND
    auth.uid() = (
      SELECT owner_id FROM public.clans WHERE id = ((storage.foldername(name))[2])::uuid
    )
  );
