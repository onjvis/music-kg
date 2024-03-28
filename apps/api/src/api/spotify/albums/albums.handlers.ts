import { Request, Response } from 'express';
import { Album, Artist, Page, SimplifiedTrack, SpotifyApi } from '@spotify/web-api-ts-sdk';

import { ErrorResponse, SpotifyAlbum } from '@music-kg/data';

import { LIMIT, MARKET } from '../spotify.constants';
import { getAlbumReleaseType } from '../spotify.helpers';

export const getAlbum = async (req: Request, res: Response<SpotifyAlbum | ErrorResponse>): Promise<void> => {
  const albumId: string = req.params.id;

  const spotifyApi: SpotifyApi = res.locals.spotifyApi;

  try {
    const getAlbumResponse: Album = await spotifyApi?.albums.get(albumId);
    const album: SpotifyAlbum = {
      albumReleaseType: getAlbumReleaseType(getAlbumResponse.album_type),
      artists: getAlbumResponse.artists?.map((artist: Artist) => artist.id),
      id: getAlbumResponse.id,
      image: getAlbumResponse.images?.[0]?.url,
      label: getAlbumResponse.label,
      name: getAlbumResponse.name,
      releaseDate: getAlbumResponse.release_date,
      spotifyUrl: getAlbumResponse.external_urls.spotify,
      totalTracks: getAlbumResponse.total_tracks,
    };

    const albumTracks: string[] = [];

    let next: string;
    let requests = 0;

    do {
      const getAlbumTracksResponse: Page<SimplifiedTrack> = await spotifyApi?.albums.tracks(
        albumId,
        MARKET,
        LIMIT,
        requests * LIMIT
      );
      albumTracks.push(...getAlbumTracksResponse.items.map((track: SimplifiedTrack) => track.id));

      next = getAlbumTracksResponse.next;
      requests++;
    } while (requests === 0 || next);

    res.status(200).send({ ...album, tracks: albumTracks });
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
