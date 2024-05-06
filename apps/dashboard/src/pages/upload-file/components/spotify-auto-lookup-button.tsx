import { useState } from 'react';
import { UseFormGetValues } from 'react-hook-form';

import { SpotifyIcon } from '../../../components/icons/spotify-icon';
import { Loader } from '../../../components/loader';
import { ApiUrl } from '../../../models/api-url.model';
import httpClient from '../../../services/http-client';
import { SpotifyAutoLookupResults } from '../models/spotify-auto-lookup-results';
import { SpotifyLookupDialogSelectionResult } from '../models/spotify-lookup-dialog-selection-result.model';
import { SpotifySearchParams } from '../models/spotify-search-params.model';
import { UploadedFileMetadata } from '../models/uploaded-file-metadata.model';

type SpotifyAutoLookupButtonProps = {
  getValues: UseFormGetValues<UploadedFileMetadata>;
  handleResults: (results: SpotifyAutoLookupResults) => void;
};

export const SpotifyAutoLookupButton = ({ getValues, handleResults }: SpotifyAutoLookupButtonProps) => {
  const [isPending, setPending] = useState<boolean>(false);

  const handleSpotifyAutoLookup = async (): Promise<void> => {
    setPending(true);

    const formValues: UploadedFileMetadata = getValues();

    const includedParameters: Partial<SpotifySearchParams> = {
      ...(formValues?.albumName ? { album: formValues?.albumName } : {}),
      ...(formValues?.artistName ? { artist: formValues?.artistName } : {}),
      ...(formValues?.isrc ? { isrc: formValues?.isrc } : {}),
      ...(formValues?.title ? { track: formValues?.title } : {}),
    };

    const track: SpotifyLookupDialogSelectionResult = await handleTrackLookup(includedParameters);

    delete includedParameters['isrc'];
    delete includedParameters['track'];

    const album: SpotifyLookupDialogSelectionResult = await handleAlbumLookup(includedParameters);

    delete includedParameters['album'];

    const artist: SpotifyLookupDialogSelectionResult = await handleArtistLookup(includedParameters);

    setPending(false);

    handleResults({ artist, album, track });
  };

  const handleAlbumLookup = async (
    params: Partial<SpotifySearchParams>
  ): Promise<SpotifyLookupDialogSelectionResult> => {
    const q: string = Object.entries(params)
      .map(([property, value]) => `${property}:${value}`)
      .join(' ');
    const url = `${ApiUrl.SPOTIFY_SEARCH}?q=${q}&type=album`;

    return httpClient
      .get(url)
      .then((response) => (response?.data?.length === 1 ? { type: 'album', ...response?.data?.[0] } : undefined));
  };

  const handleArtistLookup = async (
    params: Partial<SpotifySearchParams>
  ): Promise<SpotifyLookupDialogSelectionResult> => {
    const q: string = Object.entries(params)
      .map(([property, value]) => `${property}:${value}`)
      .join(' ');
    const url = `${ApiUrl.SPOTIFY_SEARCH}?q=${q}&type=artist`;

    return httpClient
      .get(url)
      .then((response) => (response?.data?.length === 1 ? { type: 'artist', ...response?.data?.[0] } : undefined));
  };

  const handleTrackLookup = async (
    params: Partial<SpotifySearchParams>
  ): Promise<SpotifyLookupDialogSelectionResult> => {
    const q: string = Object.entries(params)
      .map(([property, value]) => `${property}:${value}`)
      .join(' ');
    const url = `${ApiUrl.SPOTIFY_SEARCH}?q=${q}&type=track`;

    return httpClient
      .get(url)
      .then((response) => (response?.data?.length === 1 ? { type: 'track', ...response?.data?.[0] } : undefined));
  };

  return (
    <button
      className="btn-secondary flex flex-row items-center gap-2"
      onClick={handleSpotifyAutoLookup}
      disabled={isPending}
    >
      {isPending ? <Loader /> : <SpotifyIcon />}
      <span>Automatic lookup</span>
    </button>
  );
};
