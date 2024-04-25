import { Request, Response } from 'express';

import { DataOrigin, ErrorResponse } from '@music-kg/data';
import { MusicPlaylist } from '@music-kg/sparql-data';

import { getPlaylistByExternalUrl } from '../features';

export const handleFindPlaylist = async (req: Request, res: Response<MusicPlaylist | ErrorResponse>): Promise<void> => {
  const spotifyUrl: string = decodeURIComponent(req.query.spotifyUrl as string);
  const origin: DataOrigin = req.query.origin as DataOrigin;

  try {
    const playlist: MusicPlaylist = await getPlaylistByExternalUrl(spotifyUrl, origin);

    !playlist
      ? res
          .status(404)
          .send({ message: `The playlist with Spotify URL '${spotifyUrl}' does not exist in the RDF database.` })
      : res.status(200).send(playlist);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
