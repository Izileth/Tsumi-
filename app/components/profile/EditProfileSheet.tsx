import { useState, useEffect, forwardRef, useRef, useCallback, memo } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppBottomSheet } from '@/components/ui/bottom-sheet';
import { CustomButton } from '@/components/ui/custom-button';
import { ImageUpload } from './ImageUpload';
import { ProfileForm } from './ProfileForm';
import { EditJapaneseNameSheet } from './EditJapaneseNameSheet';
import { useUserProfile } from '@/app/hooks/useUserProfile';
import type { Profile } from '@/app/lib/types';
import type { User } from '@supabase/supabase-js';

type EditProfileSheetProps = {
  profile: Profile | null;
  user: User | null;
  refetch: () => void;
};

export const EditProfileSheet = memo(forwardRef<any, EditProfileSheetProps>(({ profile, user, refetch }, ref) => {
  const { updateProfile, uploadProfileAsset } = useUserProfile();

  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editGithubUsername, setEditGithubUsername] = useState('');
  const [editTwitterUsername, setEditTwitterUsername] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | null>(null);
  const [editBannerUrl, setEditBannerUrl] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [editJapaneseName, setEditJapaneseName] = useState('');

  const japaneseNameSheetRef = useRef<any>(null);

  useEffect(() => {
    if (profile) {
      setEditUsername(profile.username || '');
      setEditBio(profile.bio || '');
      setEditSlug(profile.slug || '');
      setEditWebsite(profile.website || '');
      setEditGithubUsername(profile.github || '');
      setEditTwitterUsername(profile.twitter || '');
      setEditAvatarUrl(profile.avatar_url || null);
      setEditBannerUrl(profile.banner_url || null);
      setEditJapaneseName(profile.username_jp || '');
    }
  }, [profile]);

  const handlePresentJapaneseNameModal = useCallback(() => {
    japaneseNameSheetRef.current?.present(editJapaneseName);
  }, [editJapaneseName]);

  const handleSaveJapaneseName = (newName: string) => {
    setEditJapaneseName(newName);
  };

  const handlePickImage = async (type: 'avatar' | 'banner') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'É necessário permitir o acesso à galeria para escolher uma imagem.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const localUri = result.assets[0].uri;
      // Step 1: Only set the local URI for preview. Do not upload yet.
      if (type === 'avatar') {
        setEditAvatarUrl(localUri);
      } else {
        setEditBannerUrl(localUri);
      }
    }
  };

  const slugify = (text: string) => {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  const handleSlugChange = (text: string) => {
    setEditSlug(slugify(text));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      let finalAvatarUrl = editAvatarUrl;
      // Step 2: Check if the avatar URL is a new local file. If so, upload it.
      if (editAvatarUrl && editAvatarUrl.startsWith('file://')) {
        const file = { uri: editAvatarUrl, type: 'image/jpeg', name: 'avatar.jpg' };
        finalAvatarUrl = await uploadProfileAsset(file, 'avatar');
      }

      let finalBannerUrl = editBannerUrl;
      // Step 3: Check if the banner URL is a new local file. If so, upload it.
      if (editBannerUrl && editBannerUrl.startsWith('file://')) {
        const file = { uri: editBannerUrl, type: 'image/jpeg', name: 'banner.jpg' };
        finalBannerUrl = await uploadProfileAsset(file, 'banner');
      }

      const updates: Partial<Profile> = {
        id: user.id,
        username: editUsername,
        bio: editBio,
        slug: editSlug,
        website: editWebsite || null,
        github: editGithubUsername || null,
        twitter: editTwitterUsername || null,
        avatar_url: finalAvatarUrl,
        banner_url: finalBannerUrl,
        updated_at: new Date().toISOString(),
        username_jp: editJapaneseName,
      };

      await updateProfile(updates);

      Alert.alert('Sucesso', 'Perfil atualizado!');
      if (typeof (ref as any)?.current?.dismiss === 'function') {
        (ref as any).current.dismiss();
      }
      refetch();
    } catch (e: any) {
      Alert.alert('Erro ao salvar', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AppBottomSheet
        ref={ref}
        title="Edição de Perfil"
        titleJP="プロファイル編集"
      >
        <ImageUpload
          onPickImage={handlePickImage}
          avatarUrl={editAvatarUrl}
          bannerUrl={editBannerUrl}
        />
        <ProfileForm
          user={user}
          username={editUsername}
          setUsername={setEditUsername}
          bio={editBio}
          setBio={setEditBio}
          slug={editSlug}
          handleSlugChange={handleSlugChange}
          website={editWebsite}
          setWebsite={setEditWebsite}
          githubUsername={editGithubUsername}
          setGithubUsername={setEditGithubUsername}
          twitterUsername={editTwitterUsername}
          setTwitterUsername={setEditTwitterUsername}
          newEmail={newEmail}
          setNewEmail={setNewEmail}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          japaneseName={editJapaneseName.split('')}
          onEditJapaneseName={handlePresentJapaneseNameModal}
        />
        <CustomButton
          title="Salvar Alterações"
          onPress={handleSave}
          isLoading={saving}
          className="w-full bg-red-900/20 border py-3 rounded-sm mb-12 border-red-800"
          textClassName="text-sm text-zinc-50 font-bold"
        />
      </AppBottomSheet>
      <EditJapaneseNameSheet
        ref={japaneseNameSheetRef}
        initialName={editJapaneseName}
        onSave={handleSaveJapaneseName}
      />
    </>
  );
}));

EditProfileSheet.displayName = 'EditProfileSheet';
