import { SpotifySearchMode } from '../models/spotify-search-mode.type';

const SPOTIFY_PREFIX = 'https://open.spotify.com';

export const getSpotifyEntityPrefix = (type: SpotifySearchMode): string => {
  switch (type) {
    case 'album':
      return `${SPOTIFY_PREFIX}/album`;
    case 'artist':
      return `${SPOTIFY_PREFIX}/artist`;
    case 'track':
      return `${SPOTIFY_PREFIX}/track`;
    default:
      throw new Error(`getSpotifyEntityPrefix: Error: Unsupported entity type: ${type}.`);
  }
};
