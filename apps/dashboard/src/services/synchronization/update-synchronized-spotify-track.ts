import { SimplifiedArtist, Track } from '@spotify/web-api-ts-sdk';

import { EntityData, UpdateRecordingRequest } from '@music-kg/data';
import { MusicRecording } from '@music-kg/sparql-data';

import { ApiUrl } from '../../models/api-url.model';
import httpClient from '../http-client';
import { updateSynchronizedSpotifyAlbum } from './update-synchronized-spotify-album';
import { updateSynchronizedSpotifyArtist } from './update-synchronized-spotify-artist';

export const updateSynchronizedSpotifyTrack = async (track: Track): Promise<void> => {
  const musicKGRecording: MusicRecording = await httpClient
    .get<MusicRecording>(
      `${ApiUrl.SPARQL_RECORDINGS}/find?spotifyUrl=${encodeURIComponent(track?.external_urls?.spotify)}`
    )
    .then((response) => response.data);

  if (isIncomplete(musicKGRecording)) {
    const trackData: UpdateRecordingRequest = {
      artists: track.artists?.map(
        (artist: SimplifiedArtist): EntityData => ({
          name: artist?.name,
          externalUrls: { spotify: artist?.external_urls?.spotify },
        })
      ),
      album: { name: track.album?.name, externalUrls: { spotify: track?.album?.external_urls?.spotify } },
      datePublished: track.album?.release_date,
      duration: track.duration_ms,
      isrc: track.external_ids?.isrc,
    };

    await httpClient.put(`${ApiUrl.SPARQL_RECORDINGS}/${musicKGRecording.id}?updateType=append`, trackData);
  }

  // Synchronize album metadata if available
  if (track.album?.external_urls?.spotify) {
    await updateSynchronizedSpotifyAlbum(track.album, { tracks: [{ id: musicKGRecording?.id }] });
  }

  // Synchronize artists' metadata for the track
  await Promise.all(
    track.artists?.map(
      async (artist: SimplifiedArtist): Promise<void> =>
        updateSynchronizedSpotifyArtist(artist, { tracks: [{ id: musicKGRecording?.id }] })
    )
  );
};

const isIncomplete = (track: MusicRecording): boolean => {
  return !track?.byArtist || !track?.inAlbum || !track?.datePublished || !track?.duration || !track?.isrcCode;
};
