import { SpotifyLookupDialogSelectionResult } from './spotify-lookup-dialog-selection-result.model';

export type SpotifyAutoLookupResults = {
  artist?: SpotifyLookupDialogSelectionResult;
  album?: SpotifyLookupDialogSelectionResult;
  track?: SpotifyLookupDialogSelectionResult;
};
