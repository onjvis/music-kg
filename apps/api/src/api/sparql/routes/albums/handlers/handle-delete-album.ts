import { Request, Response } from 'express';

import { ErrorResponse } from '@music-kg/data';

import { deleteAlbum } from '../features';

export const handleDeleteAlbum = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const id: string = req.params.id;

  try {
    await deleteAlbum(id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
