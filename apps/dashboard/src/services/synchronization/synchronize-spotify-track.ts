import { SimplifiedArtist, Track } from '@spotify/web-api-ts-sdk';

import { CreateRecordingRequest, DataOrigin, EntityData } from '@music-kg/data';

import { ApiUrl } from '../../models/api-url.model';
import httpClient from '../http-client';
import { updateSynchronizedSpotifyAlbum } from './update-synchronized-spotify-album';
import { updateSynchronizedSpotifyArtist } from './update-synchronized-spotify-artist';

export const synchronizeSpotifyTrack = async (track: Track): Promise<void> => {
  const trackData: CreateRecordingRequest = {
    artists: track.artists?.map(
      (artist: SimplifiedArtist): EntityData => ({
        name: artist?.name,
        externalUrls: { spotify: artist?.external_urls?.spotify },
        type: 'artist',
      })
    ),
    album: { name: track.album?.name, externalUrls: { spotify: track?.album?.external_urls?.spotify }, type: 'album' },
    name: track.name,
    datePublished: track.album?.release_date,
    duration: track.duration_ms,
    externalUrls: { spotify: track?.external_urls?.spotify },
    isrc: track.external_ids?.isrc,
  };

  const trackId: string = await httpClient
    .post(`${ApiUrl.SPARQL_RECORDINGS}?origin=${DataOrigin.SPOTIFY}`, trackData)
    .then((response) => {
      const trackLocation = response?.headers?.location;
      const locationSplit = trackLocation?.split('/');

      return locationSplit[locationSplit.length - 1];
    });

  // Synchronize album metadata if available
  if (track.album?.external_urls?.spotify) {
    await updateSynchronizedSpotifyAlbum(track.album, { tracks: [{ id: trackId, type: 'track' }] });
  }

  // Synchronize artists' metadata for the track
  await Promise.all(
    track.artists?.map(
      async (artist: SimplifiedArtist): Promise<void> =>
        updateSynchronizedSpotifyArtist(artist, { tracks: [{ id: trackId, type: 'track' }] })
    )
  );
};
