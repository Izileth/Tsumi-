-- supabase/migrations/20251110000005_add_clan_power_and_reputation.sql

-- Adicionar as colunas de poder e reputação à tabela de clãs
ALTER TABLE public.clans
ADD COLUMN power INT DEFAULT 0,
ADD COLUMN reputation INT DEFAULT 0;

-- Função para calcular o poder e a reputação do clã
CREATE OR REPLACE FUNCTION public.update_clan_power_and_reputation()
RETURNS TRIGGER AS $$
DECLARE
    total_level INT;
    member_count INT;
BEGIN
    IF TG_OP = 'UPDATE' AND NEW.clan_id IS NOT NULL THEN
        -- Quando o level de um membro é atualizado
        SELECT SUM(level), COUNT(*)
        INTO total_level, member_count
        FROM public.profiles
        WHERE clan_id = NEW.clan_id;

        UPDATE public.clans
        SET
            power = total_level,
            reputation = total_level * member_count
        WHERE id = NEW.clan_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.clan_id IS NOT NULL THEN
        -- Quando um membro sai de um clã
        SELECT SUM(level), COUNT(*)
        INTO total_level, member_count
        FROM public.profiles
        WHERE clan_id = OLD.clan_id;

        UPDATE public.clans
        SET
            power = COALESCE(total_level, 0),
            reputation = COALESCE(total_level, 0) * COALESCE(member_count, 0)
        WHERE id = OLD.clan_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o poder e a reputação do clã
CREATE TRIGGER update_clan_power_and_reputation_trigger
AFTER UPDATE ON public.profiles
FOR EACH ROW
WHEN (OLD.level IS DISTINCT FROM NEW.level OR OLD.clan_id IS DISTINCT FROM NEW.clan_id)
EXECUTE FUNCTION public.update_clan_power_and_reputation();
