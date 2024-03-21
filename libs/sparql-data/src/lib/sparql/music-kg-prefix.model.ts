enum MusicKGPrefix {
  ALBUMS = 'albums',
  ARTISTS = 'artists',
  PLAYLISTS = 'playlists',
  RECORDINGS = 'recordings',
  USERS = 'users',
}

export const MUSIC_KG_BASE_URI = '{MUSIC_KG_BASE_URI}';

export const MUSIC_KG_PREFIX = {
  [MusicKGPrefix.ALBUMS]: `${MUSIC_KG_BASE_URI}/music-kg/albums/`,
  [MusicKGPrefix.ARTISTS]: `${MUSIC_KG_BASE_URI}/music-kg/artists/`,
  [MusicKGPrefix.PLAYLISTS]: `${MUSIC_KG_BASE_URI}/music-kg/playlists/`,
  [MusicKGPrefix.RECORDINGS]: `${MUSIC_KG_BASE_URI}/music-kg/recordings/`,
  [MusicKGPrefix.USERS]: `${MUSIC_KG_BASE_URI}/music-kg/users/`,
} as const;

export const MUSIC_KG_ALBUMS_PREFIX: string = MUSIC_KG_PREFIX.albums;
export const MUSIC_KG_ARTISTS_PREFIX: string = MUSIC_KG_PREFIX.artists;
export const MUSIC_KG_PLAYLISTS_PREFIX: string = MUSIC_KG_PREFIX.playlists;
export const MUSIC_KG_RECORDINGS_PREFIX: string = MUSIC_KG_PREFIX.recordings;
export const MUSIC_KG_USERS_PREFIX: string = MUSIC_KG_PREFIX.users;
