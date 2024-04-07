import { SpotifySearchMode } from './spotify-search-mode.type';

export type SpotifyLookupDialogSelectionResult = {
  type: SpotifySearchMode;
  id: string;
};
