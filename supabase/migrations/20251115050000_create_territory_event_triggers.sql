-- Migration to fix and enhance territory event logging.

-- 1. Drop the old trigger and function that were logging to the wrong table.
DROP TRIGGER IF EXISTS on_territory_create ON public.territories;
DROP FUNCTION IF EXISTS public.log_territory_creation();

-- 2. Create a new function to handle territory events (annex, detach, update).
CREATE OR REPLACE FUNCTION public.log_territory_changes()
RETURNS TRIGGER AS $$
DECLARE
    v_clan_name TEXT;
    v_territory_name TEXT;
    v_description TEXT;
BEGIN
    -- On INSERT: A new territory is created and assigned to a clan.
    IF TG_OP = 'INSERT' AND NEW.clan_id IS NOT NULL THEN
        SELECT name INTO v_clan_name FROM public.clans WHERE id = NEW.clan_id;
        v_territory_name := NEW.name;
        v_description := v_clan_name || ' anexou um novo território: ' || v_territory_name || '.';

        INSERT INTO public.clan_events (clan_id, event_type, description, metadata)
        VALUES (NEW.clan_id, 'territory_annexed', v_description, jsonb_build_object('territory_id', NEW.id, 'territory_name', v_territory_name));

    -- On UPDATE: A territory is changed.
    ELSIF TG_OP = 'UPDATE' THEN
        -- Case 1: Territory is annexed (clan_id changes from NULL to non-NULL)
        IF OLD.clan_id IS NULL AND NEW.clan_id IS NOT NULL THEN
            SELECT name INTO v_clan_name FROM public.clans WHERE id = NEW.clan_id;
            v_territory_name := NEW.name;
            v_description := v_clan_name || ' anexou o território: ' || v_territory_name || '.';

            INSERT INTO public.clan_events (clan_id, event_type, description, metadata)
            VALUES (NEW.clan_id, 'territory_annexed', v_description, jsonb_build_object('territory_id', NEW.id, 'territory_name', v_territory_name));

        -- Case 2: Territory is detached (clan_id changes from non-NULL to NULL)
        ELSIF OLD.clan_id IS NOT NULL AND NEW.clan_id IS NULL THEN
            SELECT name INTO v_clan_name FROM public.clans WHERE id = OLD.clan_id;
            v_territory_name := NEW.name;
            v_description := v_clan_name || ' perdeu o controle do território: ' || v_territory_name || '.';

            INSERT INTO public.clan_events (clan_id, event_type, description, metadata)
            VALUES (OLD.clan_id, 'territory_detached', v_description, jsonb_build_object('territory_id', NEW.id, 'territory_name', v_territory_name));

        -- Case 3: Territory name is updated (clan_id remains the same and not NULL)
        ELSIF OLD.clan_id IS NOT NULL AND NEW.clan_id = OLD.clan_id AND OLD.name <> NEW.name THEN
            v_territory_name := NEW.name;
            v_description := 'O território ' || OLD.name || ' agora é conhecido como ' || v_territory_name || '.';

            INSERT INTO public.clan_events (clan_id, event_type, description, metadata)
            VALUES (NEW.clan_id, 'territory_updated', v_description, jsonb_build_object('territory_id', NEW.id, 'old_name', OLD.name, 'new_name', v_territory_name));
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create the trigger on the 'territories' table.
-- This trigger will fire AFTER every INSERT or UPDATE operation.
CREATE TRIGGER on_territory_change
AFTER INSERT OR UPDATE ON public.territories
FOR EACH ROW
EXECUTE FUNCTION public.log_territory_changes();

COMMENT ON TRIGGER on_territory_change ON public.territories IS 'Logs events for territory annexation, detachment, and updates.';
