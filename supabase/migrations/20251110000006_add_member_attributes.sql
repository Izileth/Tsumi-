-- supabase/migrations/20251110000006_add_member_attributes.sql

-- Adicionar as colunas de lealdade, força e inteligência à tabela de perfis
ALTER TABLE public.profiles
ADD COLUMN strength INT DEFAULT 50,
ADD COLUMN intelligence INT DEFAULT 50;

-- Função para avaliar os atributos do membro
CREATE OR REPLACE FUNCTION public.assess_member_attributes()
RETURNS void AS $$
BEGIN
    UPDATE public.profiles
    SET
        loyalty = floor(random() * 100) + 1,
        strength = floor(random() * 100) + 1,
        intelligence = floor(random() * 100) + 1
    WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql;
