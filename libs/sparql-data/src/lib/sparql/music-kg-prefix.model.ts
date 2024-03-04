enum MusicKGPrefix {
  ALBUMS = 'albums',
  ARTISTS = 'artists',
  RECORDINGS = 'recordings',
  USERS = 'users',
}

export const MUSIC_KG_BASE_URI = '{MUSIC_KG_BASE_URI}';

export const MUSIC_KG_PREFIX = {
  [MusicKGPrefix.ALBUMS]: `${MUSIC_KG_BASE_URI}/music-kg/albums/`,
  [MusicKGPrefix.ARTISTS]: `${MUSIC_KG_BASE_URI}/music-kg/artists/`,
  [MusicKGPrefix.RECORDINGS]: `${MUSIC_KG_BASE_URI}/music-kg/recordings/`,
  [MusicKGPrefix.USERS]: `${MUSIC_KG_BASE_URI}/music-kg/users/`,
} as const;

export const MUSIC_KG_USERS_PREFIX: string = MUSIC_KG_PREFIX.users;
