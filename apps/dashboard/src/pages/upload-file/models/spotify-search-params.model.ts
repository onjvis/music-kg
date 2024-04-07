import { SpotifySearchMode } from './spotify-search-mode.type';

export type SpotifySearchParams = {
  album?: string;
  artist?: string;
  isrc?: string;
  track?: string;
  type: SpotifySearchMode;
};
