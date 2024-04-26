import { SimplifiedArtist } from '@spotify/web-api-ts-sdk';

import { DataOrigin, EntityData, SpotifyArtist, UpdateArtistRequest, UpdateType } from '@music-kg/data';
import { MusicGroup } from '@music-kg/sparql-data';

import { ApiUrl } from '../../models/api-url.model';
import httpClient from '../http-client';

export const updateSynchronizedSpotifyArtist = async (
  artist: SimplifiedArtist,
  extras?: { albums?: EntityData[]; tracks?: EntityData[] }
): Promise<void> => {
  const musicKGArtist: MusicGroup = await httpClient
    .get(
      `${ApiUrl.SPARQL_ARTISTS}/find?origin=${DataOrigin.SPOTIFY}&spotifyUrl=${encodeURIComponent(
        artist.external_urls?.spotify
      )}`
    )
    .then((response) => response.data);
  let artistData: UpdateArtistRequest;

  if (isIncomplete(musicKGArtist)) {
    const spotifyArtistData: SpotifyArtist = await httpClient
      .get<SpotifyArtist>(`${ApiUrl.SPOTIFY_ARTISTS}/${artist.id}`)
      .then((response) => response.data);
    artistData = {
      externalUrls: { spotify: artist?.external_urls?.spotify },
      genres: spotifyArtistData?.genres,
      imageUrl: spotifyArtistData?.image,
      ...extras,
    };
  } else {
    artistData = {
      externalUrls: { spotify: artist?.external_urls?.spotify },
      ...extras,
    };
  }

  return await httpClient.put(
    `${ApiUrl.SPARQL_ARTISTS}/${musicKGArtist?.id}?origin=${DataOrigin.SPOTIFY}&updateType=${UpdateType.APPEND}`,
    artistData
  );
};

const isIncomplete = (artist: MusicGroup): boolean => {
  return !artist?.image || !artist?.genre;
};
