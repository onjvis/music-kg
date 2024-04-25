import { Request, Response } from 'express';

import { DataOrigin, ErrorResponse } from '@music-kg/data';
import { MusicAlbum } from '@music-kg/sparql-data';

import { getAlbum } from '../features';

export const handleGetAlbum = async (req: Request, res: Response<MusicAlbum | ErrorResponse>): Promise<void> => {
  const id: string = req.params.id;
  const origin: DataOrigin = req.query.origin as DataOrigin;

  try {
    const album: MusicAlbum = await getAlbum(id, origin);

    !album
      ? res.status(404).send({ message: `The album with id ${id} does not exist in the RDF database.` })
      : res.status(200).send({ ...album, id });
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
