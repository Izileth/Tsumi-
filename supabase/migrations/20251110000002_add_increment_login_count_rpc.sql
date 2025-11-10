-- supabase/migrations/20251110000002_add_increment_login_count_rpc.sql

CREATE OR REPLACE FUNCTION public.increment_login_count()
RETURNS void AS $$
BEGIN
    UPDATE public.profiles
    SET login_count = login_count + 1
    WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar o rank do usuário
CREATE OR REPLACE FUNCTION public.update_user_rank()
RETURNS TRIGGER AS $$
DECLARE
    new_rank RECORD;
BEGIN
    SELECT * INTO new_rank
    FROM public.ranks
    WHERE NEW.login_count >= min_logins
    ORDER BY min_logins DESC
    LIMIT 1;

    IF new_rank IS NOT NULL THEN
        NEW.rank := new_rank.name;
        NEW.rank_jp := new_rank.name_jp;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o rank quando o login_count for alterado
CREATE TRIGGER update_rank_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
WHEN (OLD.login_count IS DISTINCT FROM NEW.login_count)
EXECUTE FUNCTION public.update_user_rank();