-- supabase/migrations/20251110000004_add_policies_to_ranks_and_levels.sql

-- Habilitar RLS para a tabela de ranks
ALTER TABLE public.ranks ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS para a tabela de levels
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários autenticados leiam a tabela de ranks
CREATE POLICY "Authenticated users can read ranks"
ON public.ranks
FOR SELECT
TO authenticated
USING (true);

-- Política para permitir que usuários autenticados leiam a tabela de levels
CREATE POLICY "Authenticated users can read levels"
ON public.levels
FOR SELECT
TO authenticated
USING (true);
