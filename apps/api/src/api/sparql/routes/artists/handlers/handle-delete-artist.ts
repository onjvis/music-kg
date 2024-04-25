import { Request, Response } from 'express';

import { DataOrigin, ErrorResponse } from '@music-kg/data';

import { deleteArtist } from '../features';

export const handleDeleteArtist = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const id: string = req.params.id;
  const origin: DataOrigin = req.query.origin as DataOrigin;

  try {
    await deleteArtist(id, origin);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
