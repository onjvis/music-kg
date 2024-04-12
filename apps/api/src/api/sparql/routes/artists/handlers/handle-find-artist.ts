import { Request, Response } from 'express';

import { ErrorResponse } from '@music-kg/data';
import { MusicGroup } from '@music-kg/sparql-data';

import { getArtistByExternalUrl } from '../features';

export const handleFindArtist = async (req: Request, res: Response<MusicGroup | ErrorResponse>): Promise<void> => {
  const spotifyUrl: string = decodeURIComponent(req.query.spotifyUrl as string);

  try {
    const artist: MusicGroup = await getArtistByExternalUrl(spotifyUrl);

    !artist
      ? res
          .status(404)
          .send({ message: `The artist with Spotify URL '${spotifyUrl}' does not exist in the RDF database.` })
      : res.status(200).send(artist);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
