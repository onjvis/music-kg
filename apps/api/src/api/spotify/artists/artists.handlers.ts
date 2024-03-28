import { Request, Response } from 'express';
import { Artist, Page, SimplifiedAlbum, SpotifyApi } from '@spotify/web-api-ts-sdk';

import { ErrorResponse, SpotifyArtist } from '@music-kg/data';

import { LIMIT, MARKET } from '../spotify.constants';
import { ALBUM_INCLUDE_GROUPS } from './artists.constants';

export const getArtist = async (req: Request, res: Response<SpotifyArtist | ErrorResponse>): Promise<void> => {
  const artistId: string = req.params.id;

  const spotifyApi: SpotifyApi = res.locals.spotifyApi;

  try {
    const getArtistResponse: Artist = await spotifyApi?.artists.get(artistId);
    const artist: SpotifyArtist = {
      genres: getArtistResponse.genres,
      id: getArtistResponse.id,
      name: getArtistResponse.name,
      image: getArtistResponse.images?.[0]?.url,
      spotifyUrl: getArtistResponse.external_urls?.spotify,
    };

    const albums: string[] = [];

    let next: string;
    let requests = 0;

    do {
      const getArtistAlbumsResponse: Page<SimplifiedAlbum> = await spotifyApi?.artists.albums(
        artistId,
        ALBUM_INCLUDE_GROUPS,
        MARKET,
        LIMIT,
        requests * LIMIT
      );
      albums.push(...getArtistAlbumsResponse.items.map((album) => album.id));

      next = getArtistAlbumsResponse.next;
      requests++;
    } while (requests === 0 || next);

    res.status(200).send({ ...artist, albums });
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
