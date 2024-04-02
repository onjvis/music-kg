import { Playlist } from '@spotify/web-api-ts-sdk';

import { SpotifyPlaylist } from '@music-kg/data';

export const getMetadata = (playlist: Playlist): SpotifyPlaylist => {
  return {
    creator: playlist?.owner?.external_urls?.spotify,
    description: playlist?.description,
    id: playlist?.id,
    image: playlist?.images?.[0]?.url,
    name: playlist?.name,
    numTracks: playlist?.tracks?.total,
    spotifyUrl: playlist?.external_urls?.spotify,
    tracks: playlist?.tracks?.items?.map((trackItem) => trackItem?.track?.id),
  };
};
