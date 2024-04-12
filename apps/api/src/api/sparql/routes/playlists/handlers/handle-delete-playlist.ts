import { Request, Response } from 'express';

import { ErrorResponse } from '@music-kg/data';

import { deletePlaylist } from '../features';

export const handleDeletePlaylist = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const id: string = req.params.id;

  try {
    await deletePlaylist(id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
