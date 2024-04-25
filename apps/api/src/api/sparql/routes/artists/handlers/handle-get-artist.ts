import { Request, Response } from 'express';

import { DataOrigin, ErrorResponse } from '@music-kg/data';
import { MusicGroup } from '@music-kg/sparql-data';

import { getArtist } from '../features';

export const handleGetArtist = async (req: Request, res: Response<MusicGroup | ErrorResponse>): Promise<void> => {
  const id: string = req.params.id;
  const origin: DataOrigin = req.query.origin as DataOrigin;

  try {
    const artist: MusicGroup = await getArtist(id, origin);

    !artist
      ? res.status(404).send({ message: `The artist with id ${id} does not exist in the RDF database.` })
      : res.status(200).send({ ...artist, id });
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
