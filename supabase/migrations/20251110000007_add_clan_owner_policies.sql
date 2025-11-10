-- supabase/migrations/20251110000007_add_clan_owner_policies.sql

-- Política para permitir que o proprietário do clã veja todos os membros do seu clã
CREATE POLICY "Clan owner can see all members of their clan"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  clan_id IN (
    SELECT id
    FROM public.clans
    WHERE owner_id = auth.uid()
  )
);

-- Política para permitir que o proprietário do clã veja todos os perfis que não estão em um clã
CREATE POLICY "Clan owner can see all profiles that are not in a clan"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  clan_id IS NULL
  AND auth.uid() IN (
    SELECT owner_id
    FROM public.clans
  )
);
