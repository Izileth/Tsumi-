-- Migration: Add Japanese name to clans table
-- This migration adds a column to store the clan's name in Japanese.
-- The existing RLS policy "Proprietários podem atualizar seu próprio clã"
-- already ensures that only the clan owner can modify any column in this table,
-- so this new column is automatically protected.

ALTER TABLE public.clans
ADD COLUMN name_jp text;

COMMENT ON COLUMN public.clans.name_jp IS 'The Japanese name of the clan.';
