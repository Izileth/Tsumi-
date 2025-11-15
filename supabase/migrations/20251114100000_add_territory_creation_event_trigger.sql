-- Migration to add a trigger for logging territory creation events.

-- 1. Create a new function to be executed by the trigger.
-- This function will insert a new row into the public.events table
-- whenever a new territory is created with a clan_id already assigned.
CREATE OR REPLACE FUNCTION public.log_territory_creation()
RETURNS TRIGGER AS $$
DECLARE
    clan_name_text TEXT;
    territory_name_text TEXT;
BEGIN
    -- Only log if the new territory is assigned to a clan on creation
    IF NEW.clan_id IS NOT NULL THEN
        SELECT name INTO clan_name_text FROM public.clans WHERE id = NEW.clan_id;
        territory_name_text := NEW.name;

        INSERT INTO public.events (event_type, description, clan_id, territory_id, metadata)
        VALUES (
            'TERRITORY_CREATED',
            clan_name_text || ' estabeleceu um novo território: ' || territory_name_text || '.',
            NEW.clan_id,
            NEW.id,
            jsonb_build_object('creator_id', auth.uid())
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger on the 'territories' table.
-- This trigger will fire AFTER every INSERT operation on the table.
CREATE TRIGGER on_territory_create
AFTER INSERT ON public.territories
FOR EACH ROW
EXECUTE FUNCTION public.log_territory_creation();

COMMENT ON TRIGGER on_territory_create ON public.territories IS 'Logs an event when a new territory is created and assigned to a clan.';
