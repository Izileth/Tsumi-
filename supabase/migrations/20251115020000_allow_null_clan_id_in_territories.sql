-- Migration to allow NULL values in the 'clan_id' column of the 'territories' table.

-- This change is necessary to allow for the existence of neutral, unowned territories
-- that can be annexed by clans later. The original table creation enforced that
-- every territory must have a clan, which conflicts with this gameplay mechanic.

ALTER TABLE public.territories
ALTER COLUMN clan_id DROP NOT NULL;

COMMENT ON TABLE public.territories IS 'Allow territories to be neutral (not belonging to any clan).';
