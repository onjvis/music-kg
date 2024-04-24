import { Playlist, PlaylistedTrack, Track } from '@spotify/web-api-ts-sdk';

import { CreatePlaylistRequest, EntityData } from '@music-kg/data';

import { ApiUrl } from '../../models/api-url.model';
import httpClient from '../http-client';
import { updateSynchronizedSpotifyTrack } from './update-synchronized-spotify-track';

export const synchronizeSpotifyPlaylist = async (playlist: Playlist): Promise<void> => {
  const playlistData: CreatePlaylistRequest = {
    creators: {
      name: playlist?.owner?.display_name,
      externalUrls: { spotify: playlist?.owner?.external_urls?.spotify },
    },
    description: playlist?.description,
    externalUrls: { spotify: playlist?.external_urls?.spotify },
    imageUrl: playlist?.images?.[0]?.url,
    name: playlist?.name,
    numTracks: playlist?.tracks?.total,
    tracks: playlist?.tracks?.items?.map(
      (item: PlaylistedTrack): EntityData => ({
        name: item?.track?.name,
        externalUrls: { spotify: item?.track?.external_urls?.spotify },
      })
    ),
  };

  await httpClient.post(ApiUrl.SPARQL_PLAYLISTS, playlistData);

  // Synchronize all tracks from playlist
  if (playlist?.tracks?.items) {
    for (const track of playlist.tracks.items.map((item: PlaylistedTrack) => item.track)) {
      await updateSynchronizedSpotifyTrack(track as Track);
    }
  }
};
