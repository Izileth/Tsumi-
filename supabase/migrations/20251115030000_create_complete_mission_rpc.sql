-- Migration to create an RPC function for completing a mission atomically.

-- 1. Create the function `complete_mission`
CREATE OR REPLACE FUNCTION public.complete_mission(
  p_mission_id uuid,
  p_member_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_mission record;
  v_member_profile record;
  v_clan_id uuid;
  v_reputation_reward int;
BEGIN
  -- Get the mission details
  SELECT * INTO v_mission FROM public.missions WHERE id = p_mission_id;

  -- If mission does not exist, raise an error
  IF v_mission IS NULL THEN
    RAISE EXCEPTION 'Mission not found';
  END IF;

  -- Get the territory to find the clan_id
  SELECT clan_id INTO v_clan_id FROM public.territories WHERE id = v_mission.territory_id;

  -- Get the profile of the user trying to complete the mission
  SELECT * INTO v_member_profile FROM public.profiles WHERE id = p_member_id;

  -- Check if the user is a member of the clan that owns the territory
  IF v_member_profile.clan_id IS NULL OR v_member_profile.clan_id <> v_clan_id THEN
    RAISE EXCEPTION 'User is not a member of the required clan';
  END IF;

  -- Get the reputation reward from the JSONB field
  v_reputation_reward := (v_mission.reward->>'reputation')::int;

  -- Update the clan's reputation
  IF v_reputation_reward > 0 THEN
    UPDATE public.clans
    SET reputation = reputation + v_reputation_reward
    WHERE id = v_clan_id;
  END IF;

  -- Log the completion event
  INSERT INTO public.clan_events (clan_id, event_type, description, metadata)
  VALUES (
    v_clan_id,
    'mission_completed',
    'A missão "' || v_mission.name || '" foi concluída com sucesso.',
    jsonb_build_object('mission_id', p_mission_id, 'completed_by', p_member_id, 'reward', v_mission.reward)
  );

  -- Delete the completed mission
  DELETE FROM public.missions WHERE id = p_mission_id;

END;
$$;

COMMENT ON FUNCTION public.complete_mission(uuid, uuid) IS 'Allows a clan member to complete a mission, receive rewards, log the event, and delete the mission atomically.';
