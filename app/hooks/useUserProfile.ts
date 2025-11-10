import { useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/auth-context';
import { Profile } from '../lib/types';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
                .select(`
          *,
          rank,
          rank_jp,
          level,
          experience,
          level_name,
          level_name_jp,
          clans (
            *,
            profiles (
              username
            )
          )
        `)
        .eq('id', user.id);

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        setProfile(data[0] as Profile);
      } else {
        setProfile(null);
      }

    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        fetchProfile();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
};
