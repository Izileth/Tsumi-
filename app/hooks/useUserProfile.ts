import { useState, useEffect, useCallback } from 'react';
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
            power,
            reputation,
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

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return null;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
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
            power,
            reputation,
            profiles (
              username
            )
          )
        `)
        .single();

      if (error) throw error;
      setProfile(data as Profile);
      return data;
    } catch (e) {
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadProfileAsset = async (file: any, assetType: 'avatar' | 'banner') => {
    if (!file || !user) return null;

    try {
      const fileExt = file.uri.split('.').pop();
      const fileName = `${assetType}-${Date.now()}.${fileExt}`;
      const filePath = `users/${user.id}/${fileName}`;

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: fileName,
        type: file.type || `image/${fileExt}`,
      } as any);

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, formData, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      // This function should only upload and return the URL.
      // The calling component is responsible for updating the profile.
      return publicUrl;
    } catch (e: any) {
      // Alert.alert('Erro ao fazer upload do arquivo', e.message);
      console.error('Upload Error:', e);
      return null;
    }
  };

  return { profile, loading, error, refetch: fetchProfile, updateProfile, uploadProfileAsset };
};
