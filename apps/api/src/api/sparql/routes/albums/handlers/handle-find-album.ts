import { Request, Response } from 'express';

import { DataOrigin, ErrorResponse } from '@music-kg/data';
import { MusicAlbum } from '@music-kg/sparql-data';

import { getAlbumByExternalUrl } from '../features';

export const handleFindAlbum = async (req: Request, res: Response<MusicAlbum | ErrorResponse>): Promise<void> => {
  const spotifyUrl: string = decodeURIComponent(req.query.spotifyUrl as string);
  const origin: DataOrigin = req.query.origin as DataOrigin;

  try {
    const album: MusicAlbum = await getAlbumByExternalUrl(spotifyUrl, origin);

    !album
      ? res
          .status(404)
          .send({ message: `The album with Spotify URL '${spotifyUrl}' does not exist in the RDF database.` })
      : res.status(200).send(album);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
