// app/lib/types.ts
export type Clan = {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: string;
  banner_url?: string | null;
  avatar_url?: string | null;
  tag?: string | null;
  emblem?: string | null;
  power?: number;
  reputation?: number;
  profiles: {
    username: string;
  } | null;
};

export type Profile = {
  id: string;
  updated_at: string;
  username: string;
  avatar_url: string | null;
  website: string | null;
  clan_id?: string | null;
  // from joins
  clans: Clan | null;
  // other fields from profile screen
  bio?: string | null;
  slug?: string | null;
  github?: string | null;
  twitter?: string | null;
  banner_url?: string | null;
  rank_jp?: string;
  rank?: string;
  level?: number;
  experience?: number;
  level_name?: string;
  level_name_jp?: string;
  joined_date?: string;
  username_jp?: string;
};
