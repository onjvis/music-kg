import { Request, Response } from 'express';

import { DataOrigin, ErrorResponse } from '@music-kg/data';
import { MusicPlaylist } from '@music-kg/sparql-data';

import { getPlaylist } from '../features';

export const handleGetPlaylist = async (req: Request, res: Response<MusicPlaylist | ErrorResponse>): Promise<void> => {
  const id: string = req.params.id;
  const origin: DataOrigin = req.query.origin as DataOrigin;

  try {
    const playlist: MusicPlaylist = await getPlaylist(id, origin);

    !playlist
      ? res.status(404).send({ message: `The playlist with id ${id} does not exist in the RDF database.` })
      : res.status(200).send({ ...playlist, id });
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
