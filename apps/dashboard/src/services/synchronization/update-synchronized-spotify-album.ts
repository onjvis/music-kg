import { SimplifiedAlbum, SimplifiedArtist } from '@spotify/web-api-ts-sdk';

import { DataOrigin, EntityData, UpdateAlbumRequest, UpdateType } from '@music-kg/data';
import { MusicAlbum, MusicAlbumProductionType, MusicAlbumReleaseType } from '@music-kg/sparql-data';

import { ApiUrl } from '../../models/api-url.model';
import httpClient from '../http-client';
import { updateSynchronizedSpotifyArtist } from './update-synchronized-spotify-artist';

export const updateSynchronizedSpotifyAlbum = async (
  album: SimplifiedAlbum,
  extras?: { tracks?: EntityData[] }
): Promise<void> => {
  const musicKGAlbum: MusicAlbum = await httpClient
    .get<MusicAlbum>(
      `${ApiUrl.SPARQL_ALBUMS}/find?origin=${DataOrigin.SPOTIFY}&spotifyUrl=${encodeURIComponent(
        album?.external_urls?.spotify
      )}`
    )
    .then((response) => response.data);
  let albumData: UpdateAlbumRequest;

  if (isIncomplete(musicKGAlbum)) {
    albumData = {
      artists: album?.artists?.map(
        (artist: SimplifiedArtist): EntityData => ({
          name: artist?.name,
          externalUrls: { spotify: artist?.external_urls?.spotify },
          type: 'artist',
        })
      ),
      datePublished: album?.release_date,
      imageUrl: album?.images?.[0]?.url,
      numTracks: album?.total_tracks,
      externalUrls: { spotify: album?.external_urls?.spotify },
      ...extras,
      ...mapSpotifyAlbumType(album.album_type),
    };
  } else {
    albumData = {
      externalUrls: { spotify: album?.external_urls?.spotify },
      ...extras,
    };
  }

  await httpClient.put(
    `${ApiUrl.SPARQL_ALBUMS}/${musicKGAlbum.id}?origin=${DataOrigin.SPOTIFY}&updateType=${UpdateType.APPEND}`,
    albumData
  );

  // Synchronize artists' metadata for the album
  await Promise.all(
    album?.artists?.map(
      async (artist: SimplifiedArtist): Promise<void> =>
        updateSynchronizedSpotifyArtist(artist, { albums: [{ id: musicKGAlbum?.id, type: 'album' }] })
    )
  );
};

const mapSpotifyAlbumType = (albumType: string): Partial<UpdateAlbumRequest> => {
  switch (albumType) {
    case 'album':
      return {
        albumProductionType: MusicAlbumProductionType.StudioAlbum,
        albumReleaseType: MusicAlbumReleaseType.AlbumRelease,
      };
    case 'compilation':
      return {
        albumProductionType: MusicAlbumProductionType.CompilationAlbum,
        albumReleaseType: MusicAlbumReleaseType.AlbumRelease,
      };
    case 'single':
      return {
        albumProductionType: MusicAlbumProductionType.StudioAlbum,
        albumReleaseType: MusicAlbumReleaseType.SingleRelease,
      };
    default:
      return {};
  }
};

const isIncomplete = (album: MusicAlbum): boolean => {
  return (
    !album?.albumProductionType ||
    !album?.albumReleaseType ||
    !album?.byArtist ||
    !album?.datePublished ||
    !album?.image ||
    !album?.numTracks
  );
};
